import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {graphMarkup} from '../web/graph.mjs';
import {initialState} from '../web/core.mjs';

const data=JSON.parse(fs.readFileSync(new URL('../web/data/catalogue.json',import.meta.url)));
const state=overrides=>({...initialState(),language:'en',...overrides});
const visibleMarkup=html=>html.replace(/<details\b[\s\S]*?<\/details>/g,'');

test('atlas begins with seven subject destinations without expanding the course catalogue',()=>{
  const html=graphMarkup(data,state({graphMode:'subjects'}));
  assert.equal((html.match(/data-atlas-subject=/g)??[]).length,7);
  assert.equal((html.match(/data-node=/g)??[]).length,0);
  assert.equal((html.match(/data-atlas-course=/g)??[]).length,0);
  assert.ok(html.includes('data-map="physics.velocity-calculus"'));
});

test('a subject route contains each eligible course once, and filtering preserves course levels',()=>{
  for(const group of ['F','M','P','C','B','S','X'])for(const level of ['all','H','U','O']){
    const html=graphMarkup(data,state({graphMode:'subject',activeGroup:group,atlasLevel:level}));
    const ids=[...html.matchAll(/data-atlas-course="([^"]+)"/g)].map(m=>m[1]);
    const expected=data.courses.filter(c=>c.group===group&&(level==='all'||c.levels.includes(level))).map(c=>c.id);
    assert.deepEqual(ids.toSorted(),expected.toSorted(),`${group}/${level}`);
  }
});

test('focused lesson map preserves direct cross-subject dependencies and hides unrelated topics',()=>{
  const html=graphMarkup(data,state({graphMode:'lessons',selectedLesson:'physics.velocity-calculus'}));
  const lesson=data.lessons.find(l=>l.id==='physics.velocity-calculus');
  for(const id of lesson.prerequisites)assert.ok(html.includes(`data-node="${id}"`));
  assert.ok(html.includes('BRIDGE'));
  assert.ok(html.includes('Mathematics'));
  assert.ok(!html.includes('data-node="biology.life"'));
  assert.ok(html.includes('data-action="route"'));
});

test('busy prerequisite junctions disclose additional neighbors without crowding the initial view',()=>{
  const html=graphMarkup(data,state({graphMode:'courses',selectedCourse:'M09'}));
  const course=data.courses.find(c=>c.id==='M09');
  const neighbors=[...course.fullRouteReadiness,...data.courses.filter(c=>c.fullRouteReadiness.includes('M09')).map(c=>c.id)];
  for(const id of neighbors)assert.ok(html.includes(`data-node="${id}"`));
  assert.ok((visibleMarkup(html).match(/data-node=/g)??[]).length<=6);
  assert.equal((html.match(/class="spine-step"/g)??[]).length,6);
});

test('topic titles are escaped in focused navigation in both languages',()=>{
  const unsafe={id:'fixture',group:'M',title:{en:'<script>bad()</script>',zh:'<img src=x onerror=bad()>'},summary:{en:'A & B',zh:'甲 & 乙'},prerequisites:[],exercises:[]};
  for(const language of ['en','zh']){
    const html=graphMarkup({...data,lessons:[unsafe]},state({language,graphMode:'lessons',selectedLesson:'fixture'}));
    assert.ok(!html.includes('<script>'));
    assert.ok(!html.includes('<img src=x'));
    assert.ok(html.includes('&lt;'));
  }
});
