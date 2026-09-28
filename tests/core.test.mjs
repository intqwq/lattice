import test from 'node:test';
import assert from 'node:assert/strict';
import { numericValue, grade, topological, routeTo, indexLessons, ancestors,
  initialState, recordAttempt, progressEvidence, lessonStatus, validateImport, escape } from '../web/core.mjs';

const numeric = { id: 'ex-number', type: 'numeric', answer: 0.5, tolerance: 0.001 };
const choice = { id: 'ex-choice', type: 'choice', answer: 'b', options: [{id:'a'}, {id:'b'}] };
const lesson = { id:'math.example', courseId:'F01', prerequisites:[], exercises:[numeric, choice] };
const courses = [{id:'F01'}];
const at = 1000;
const attempt = (exerciseId, answer, overrides={}) => ({exerciseId, answer, correct:true, assisted:false, at, ...overrides});
const backup = progress => ({version:1, state:{progress}});

test('numeric input supports signed decimals, scientific notation and one fraction', () => {
  const valid = [ ['0',0], [' -12 ',-12], ['−2',-2], ['+.25',.25], ['2.',2], ['1e3',1000],
    ['2.5E-2',.025], [' 1 / 2 ',.5], ['-3/-4',.75], ['1e-2 / 2e1',.0005], ['0/5',0] ];
  for (const [input,expected] of valid) assert.equal(numericValue(input),expected,input);
});

test('numeric input rejects undefined values, overflow and executable expressions', () => {
  const invalid = ['', ' ', '.', '-', 'NaN', 'Infinity', '-Infinity', '1e309', '1/1e309',
    '1e309/2', '0/0', '1/0', '1/-0', '1/1e-9999', '1/2/3', '2+2', '2**3',
    'Math.sqrt(4)', 'globalThis.__latticeInjected = true', '<script>alert(1)</script>',
    '0x10', '1,000', '1_000', '2 3', '1e', 'null', 'undefined'];
  for (const input of invalid) assert.equal(numericValue(input),null,input);
  assert.equal(globalThis.__latticeInjected,undefined);
});

test('grading respects explicit and default tolerances and invalid input stays invalid', () => {
  assert.deepEqual(grade(numeric,'1/2'),{valid:true,correct:true});
  assert.deepEqual(grade(numeric,'0.5009'),{valid:true,correct:true});
  assert.deepEqual(grade(numeric,'0.5011'),{valid:true,correct:false});
  assert.deepEqual(grade(numeric,'1/0'),{valid:false,correct:false});
  const large={type:'numeric',answer:1e8};
  assert.equal(grade(large,'100000000.5').correct,true);
  assert.equal(grade(large,'100000002').correct,false);
  const zero={type:'numeric',answer:0};
  assert.equal(grade(zero,'5e-10').correct,true);
  assert.equal(grade(zero,'2e-9').correct,false);
});

test('choice grading checks membership as well as the answer key', () => {
  assert.deepEqual(grade(choice,'b'),{valid:true,correct:true});
  assert.deepEqual(grade(choice,'a'),{valid:true,correct:false});
  assert.deepEqual(grade(choice,'c'),{valid:false,correct:false});
  assert.deepEqual(grade({...choice,answer:'c'},'c'),{valid:false,correct:false});
});

const graph = [
  {id:'physics.goal',prerequisites:['math.left','math.right']},
  {id:'math.right',prerequisites:['foundation']},
  {id:'unrelated',prerequisites:[]},
  {id:'math.left',prerequisites:['foundation']},
  {id:'foundation',prerequisites:[]},
];

test('topological ordering includes shared prerequisites once before every dependent', () => {
  const ordered=topological(graph).map(x=>x.id);
  assert.equal(new Set(ordered).size,graph.length);
  for(const node of graph) for(const prerequisite of node.prerequisites)
    assert.ok(ordered.indexOf(prerequisite)<ordered.indexOf(node.id));
  assert.deepEqual(topological([]),[]);
});

test('invalid dependency catalogues fail explicitly', () => {
  assert.throws(()=>topological([{id:'a',prerequisites:['missing']}]),/Missing prerequisite missing/);
  assert.throws(()=>topological([{id:'a',prerequisites:['b']},{id:'b',prerequisites:['a']}]),/cycle/i);
  assert.throws(()=>topological([{id:'a',prerequisites:['a']}]),/cycle/i);
  assert.throws(()=>topological([{id:'a',prerequisites:[]},{id:'a',prerequisites:[]}]),/Duplicate/);
});

test('goal route is the complete prerequisite closure and excludes unrelated nodes', () => {
  const route=routeTo('physics.goal',graph).map(x=>x.id);
  assert.deepEqual(new Set(route),new Set(['foundation','math.left','math.right','physics.goal']));
  assert.equal(route[0],'foundation');
  assert.equal(route.at(-1),'physics.goal');
  assert.deepEqual(ancestors('physics.goal',indexLessons(graph)),new Set(['math.left','foundation','math.right']));
  assert.deepEqual(routeTo('foundation',graph).map(x=>x.id),['foundation']);
});

test('assisted answers and repeats do not inflate independent exercise evidence', () => {
  const state=initialState();
  recordAttempt(state,lesson,numeric,grade(numeric,'.5'),true,'.5',at);
  recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',at+1);
  recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',at+2);
  assert.equal(progressEvidence(lesson,state),1);
  assert.equal(lessonStatus(lesson,state,at+2),'learning');
  assert.equal(state.progress[lesson.id].practicedAt,undefined);
  recordAttempt(state,lesson,numeric,grade(numeric,'.5'),false,'.5',at+3);
  assert.equal(progressEvidence(lesson,state),1);
  assert.equal(state.progress[lesson.id].attempts.at(-1).assisted,true);
  assert.equal(state.progress[lesson.id].practicedAt,undefined);
  assert.equal(state.progress[lesson.id].mastered,undefined);
});

test('fresh independent correct answers produce practice evidence and a due reminder', () => {
  const state=initialState();
  recordAttempt(state,lesson,numeric,grade(numeric,'.5'),false,'.5',at);
  recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',at+1);
  assert.equal(progressEvidence(lesson,state),2);
  assert.equal(state.progress[lesson.id].practicedAt,at+1);
  assert.equal(lessonStatus(lesson,state,at+2),'practiced');
  assert.equal(lessonStatus(lesson,state,at+1+3*86400000),'due');
});

test('attempt recording regrades actual answers, ignores invalid input, and caps history', () => {
  const state=initialState();
  recordAttempt(state,lesson,numeric,{valid:true,correct:true},false,'incorrect',at);
  assert.equal(state.progress[lesson.id],undefined);
  recordAttempt(state,lesson,numeric,{valid:false,correct:true},false,'.5',at);
  assert.equal(state.progress[lesson.id],undefined);
  recordAttempt(state,lesson,numeric,{valid:'false',correct:true},false,'.5',at);
  assert.equal(state.progress[lesson.id],undefined);
  recordAttempt(state,lesson,numeric,{valid:true,correct:true},false,'8',at);
  assert.equal(state.progress[lesson.id].attempts[0].correct,false);
  for(let i=0;i<205;i++) recordAttempt(state,lesson,numeric,grade(numeric,'.5'),false,'.5',at+i);
  assert.equal(state.progress[lesson.id].attempts.length,200);
  assert.equal(progressEvidence(lesson,state),0);
  assert.throws(()=>recordAttempt(state,lesson,{...numeric,id:'unknown'},{valid:true,correct:true},false,'.5'),/Unknown exercise/);
});

test('epoch-zero timestamps are valid practice and due dates', () => {
  const state=initialState();
  recordAttempt(state,lesson,numeric,grade(numeric,'.5'),false,'.5',0);
  recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',0);
  assert.equal(lessonStatus(lesson,state,0),'practiced');
  assert.equal(lessonStatus(lesson,state,3*86400000),'due');
});

test('new assessment versions require new evidence while preserving earlier work',()=>{
  const state=initialState();
  recordAttempt(state,lesson,numeric,grade(numeric,'.5'),false,'.5',at);
  recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',at+1);
  state.notes[lesson.id]='My earlier reasoning';
  const revisedQuestion={...numeric,id:'ex-number-v2',answer:2};
  const revisedLesson={...lesson,exercises:[revisedQuestion,choice]};
  assert.equal(lessonStatus(revisedLesson,state,at+2),'learning');
  assert.equal(progressEvidence(revisedLesson,state),1);
  recordAttempt(state,revisedLesson,revisedQuestion,grade(revisedQuestion,'2'),false,'2',at+10);
  assert.equal(lessonStatus(revisedLesson,state,at+11),'practiced');
  assert.equal(state.progress[lesson.id].practicedAt,at+10);
  assert.equal(state.progress[lesson.id].attempts.length,3);
  assert.equal(state.notes[lesson.id],'My earlier reasoning');
  const restored=validateImport({version:1,state},[revisedLesson],courses);
  assert.equal(restored.progress[lesson.id].attempts.length,2);
  assert.deepEqual(restored.progress[lesson.id].retiredAttempts,[{exerciseId:numeric.id,answer:'.5',at}]);
  assert.equal(progressEvidence(revisedLesson,restored),2);
  const restoredAgain=validateImport({version:1,state:restored},[revisedLesson],courses);
  assert.equal(restoredAgain.progress[lesson.id].retiredAttempts.length,1);
});

test('backup validation rejects unsupported outer formats', () => {
  for(const bad of [null,[],{}, {version:2},{version:1,state:[]}, {version:1,state:'text'}])
    assert.throws(()=>validateImport(bad,[lesson],courses));
});

test('backup import ignores unknown IDs and does not copy untrusted fields or prototypes', () => {
  const value=JSON.parse('{"version":1,"state":{"language":"script","theme":"invalid","selectedLesson":"unknown","selectedCourse":"unknown","routeGoal":"unknown","progress":{"unknown":{"mastered":true}},"notes":{"__proto__":{"polluted":true},"unknown":"ignored","math.example":"<script>alert(1)</script>"},"mastered":true,"__proto__":{"polluted":true}}}');
  const imported=validateImport(value,[lesson],courses);
  assert.equal(imported.language,'en');
  assert.equal(imported.theme,'light');
  assert.equal(imported.routeGoal,null);
  assert.deepEqual(imported.progress,{});
  assert.equal(imported.notes.unknown,undefined);
  assert.equal(imported.notes[lesson.id],'<script>alert(1)</script>');
  assert.equal(imported.mastered,undefined);
  assert.equal({}.polluted,undefined);
  assert.equal(escape(imported.notes[lesson.id]),'&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('imported practice requires all independent, regraded exercise answers', () => {
  const imported=validateImport(backup({[lesson.id]:{startedAt:10,practicedAt:20,dueAt:30,mastered:true,
    attempts:[attempt(numeric.id,'99'),attempt(choice.id,'b')]}}),[lesson],courses);
  assert.equal(imported.progress[lesson.id].attempts[0].correct,false);
  assert.equal(progressEvidence(lesson,imported),1);
  assert.equal(imported.progress[lesson.id].practicedAt,undefined);
  assert.equal(imported.progress[lesson.id].mastered,undefined);
  const assisted=validateImport(backup({[lesson.id]:{practicedAt:20,attempts:[
    attempt(numeric.id,'.5',{assisted:true}),attempt(choice.id,'b')]}}),[lesson],courses);
  assert.equal(assisted.progress[lesson.id].practicedAt,undefined);
  const noAttempts=validateImport(backup({[lesson.id]:{practicedAt:20,mastered:true}}),[lesson],courses);
  assert.equal(noAttempts.progress[lesson.id].practicedAt,undefined);
});

test('valid backup restores confirmed practice and repairs an invalid due date', () => {
  const imported=validateImport({version:1,state:{language:'zh',theme:'dark',selectedLesson:lesson.id,
    lastLesson:lesson.id,selectedCourse:'F01',routeGoal:lesson.id,notes:{[lesson.id]:'own note'},code:{[lesson.id]:'int main() {}'},
    progress:{[lesson.id]:{startedAt:0,practicedAt:100,dueAt:50,attempts:[attempt(numeric.id,'1/2'),attempt(choice.id,'b')]}}}},[lesson],courses);
  assert.equal(imported.language,'zh');
  assert.equal(imported.selectedLesson,lesson.id);
  assert.equal(imported.routeGoal,lesson.id);
  assert.equal(imported.notes[lesson.id],'own note');
  assert.equal(imported.code[lesson.id],'int main() {}');
  assert.equal(imported.progress[lesson.id].practicedAt,100);
  assert.equal(imported.progress[lesson.id].dueAt,100+3*86400000);
  assert.equal(progressEvidence(lesson,imported),2);
});

test('malformed imported attempts and oversized text cannot supply evidence', () => {
  const attempts=[null,attempt('unknown','b'),attempt(numeric.id,'.5',{at:Infinity}),
    attempt(numeric.id,'.5',{at:-1}),attempt(numeric.id,'.5',{assisted:'false'}),
    attempt(numeric.id,'1/0'),attempt(numeric.id,'Infinity'),attempt(numeric.id,'globalThis.__latticeInjected=true'),
    attempt(numeric.id,{toString:'not executable'}),attempt(numeric.id,'1'.repeat(1001)),
    attempt(choice.id,'unknown')];
  const imported=validateImport({version:1,state:{notes:{[lesson.id]:'x'.repeat(50001)},code:{[lesson.id]:'x'.repeat(200001)},
    progress:{[lesson.id]:{attempts,practicedAt:2}}}},[lesson],courses);
  assert.deepEqual(imported.progress[lesson.id].attempts,[]);
  assert.equal(imported.progress[lesson.id].practicedAt,undefined);
  assert.equal(imported.notes[lesson.id],undefined);
  assert.equal(imported.code[lesson.id],undefined);
  assert.equal(globalThis.__latticeInjected,undefined);
});

test('import caps retained history and empty lessons do not gain practice status', () => {
  const many=Array.from({length:250},(_,i)=>attempt(numeric.id,'.5',{at:i}));
  const imported=validateImport(backup({[lesson.id]:{attempts:many,practicedAt:100}}),[lesson],courses);
  assert.equal(imported.progress[lesson.id].attempts.length,200);
  assert.equal(imported.progress[lesson.id].attempts[0].at,0);
  const empty={...lesson,id:'empty',exercises:[]};
  const emptyImport=validateImport(backup({empty:{attempts:[],practicedAt:100}}),[empty],courses);
  assert.equal(emptyImport.progress.empty.practicedAt,undefined);
});

test('hint-only exposure survives backup restore and cannot become independent evidence', () => {
  const imported=validateImport(backup({[lesson.id]:{startedAt:10,attempts:[],
    assistedExercises:[numeric.id,numeric.id,'unknown','__proto__',null,42]}}),[lesson],courses);
  assert.deepEqual(imported.progress[lesson.id].assistedExercises,[numeric.id]);
  recordAttempt(imported,lesson,numeric,grade(numeric,'.5'),false,'.5',at);
  assert.equal(imported.progress[lesson.id].attempts[0].assisted,true);
  assert.equal(progressEvidence(lesson,imported),0);
});

test('checked incorrect items remain exposed after attempts are evicted and across restore', () => {
  const state=initialState();
  recordAttempt(state,lesson,numeric,grade(numeric,'.9'),false,'.9',1);
  for(let i=0;i<205;i++)recordAttempt(state,lesson,choice,grade(choice,'a'),false,'a',i+2);
  assert.equal(state.progress[lesson.id].attempts.some(a=>a.exerciseId===numeric.id),false);
  assert.ok(state.progress[lesson.id].assistedExercises.includes(numeric.id));
  const restored=validateImport({version:1,state},[lesson],courses);
  recordAttempt(restored,lesson,numeric,grade(numeric,'.5'),false,'.5',1000);
  assert.equal(restored.progress[lesson.id].attempts.at(-1).assisted,true);
  assert.equal(progressEvidence(lesson,restored),0);
});

test('legacy attempts imply future exposure without erasing earlier independent evidence', () => {
  const restored=validateImport(backup({[lesson.id]:{attempts:[attempt(numeric.id,'.5')],practicedAt:20}}),[lesson],courses);
  assert.deepEqual(restored.progress[lesson.id].assistedExercises,[numeric.id]);
  assert.equal(progressEvidence(lesson,restored),1);
  recordAttempt(restored,lesson,numeric,grade(numeric,'.5'),false,'.5',at+1);
  assert.equal(restored.progress[lesson.id].attempts.at(-1).assisted,true);
  assert.equal(progressEvidence(lesson,restored),1);
});

test('the history cap retains the earliest independent correct evidence for each exercise', () => {
  const state=initialState();
  recordAttempt(state,lesson,numeric,grade(numeric,'.5'),false,'.5',1);
  recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',2);
  for(let i=0;i<250;i++)recordAttempt(state,lesson,choice,grade(choice,'b'),false,'b',i+3);
  assert.equal(state.progress[lesson.id].attempts.length,200);
  assert.equal(state.progress[lesson.id].attempts[0].at,1);
  assert.equal(state.progress[lesson.id].attempts[1].at,2);
  assert.equal(progressEvidence(lesson,state),2);
  assert.equal(lessonStatus(lesson,state,999),'practiced');
  const restored=validateImport({version:1,state},[lesson],courses);
  assert.equal(restored.progress[lesson.id].attempts.length,200);
  assert.equal(progressEvidence(lesson,restored),2);
  assert.equal(restored.progress[lesson.id].practicedAt,2);
});

test('restored explicit review timestamps must fall between confirmed practice and due date', () => {
  const progress={attempts:[attempt(numeric.id,'.5'),attempt(choice.id,'b')],practicedAt:100,dueAt:500};
  const valid=validateImport(backup({[lesson.id]:{...progress,reviewedAt:250}}),[lesson],courses);
  assert.equal(valid.progress[lesson.id].reviewedAt,250);
  for(const reviewedAt of [-1,99,501,Infinity,NaN,'250']){
    const imported=validateImport(backup({[lesson.id]:{...progress,reviewedAt}}),[lesson],courses);
    assert.equal(imported.progress[lesson.id].reviewedAt,undefined);
  }
  const unconfirmed=validateImport(backup({[lesson.id]:{...progress,attempts:[],reviewedAt:250}}),[lesson],courses);
  assert.equal(unconfirmed.progress[lesson.id].reviewedAt,undefined);
});
