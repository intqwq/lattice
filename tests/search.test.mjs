import test from 'node:test';
import assert from 'node:assert/strict';
import {searchCatalogue} from '../web/search.mjs';

const lesson=(id,en,zh,body)=>({id,title:{en,zh},moduleId:'M01.01',courseId:'M01',sections:[{body:{en:body,zh:'细节中的概念：反例。'}}]});
const data={lessons:[lesson('a','Logic','逻辑','A proof can fail at a quantifier.'),lesson('b','Quantifiers','量词','A universal claim covers every member.')],courses:[{id:'M01',title:{en:'Algebra',zh:'代数'},modules:[]}],outlines:{'M01.01':{concepts:[{en:'necessary condition',zh:'必要条件'}]}}};

test('search finds concepts inside teaching prose in either language',()=>{
  assert.deepEqual(searchCatalogue(data,'quantifier').lessons.map(l=>l.id),['b','a']);
  assert.equal(searchCatalogue(data,'反例').lessons.length,2);
  assert.equal(searchCatalogue(data,'必要条件').lessons.length,2);
});

test('search handles course codes, full-width input, blanks and punctuation literally',()=>{
  assert.equal(searchCatalogue(data,'Ｍ０１').courses[0].id,'M01');
  assert.deepEqual(searchCatalogue(data,' ').lessons,[]);
  assert.deepEqual(searchCatalogue(data,'[').lessons,[]);
  assert.equal(searchCatalogue(data,'代数').courses[0].id,'M01');
});
