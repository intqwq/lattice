import test from 'node:test';
import assert from 'node:assert/strict';
import {orderChoices} from '../web/choices.mjs';

test('choice ordering is stable, preserves IDs and never changes authored options',()=>{
  const exercise={id:'chemistry-example',options:[{id:'a'},{id:'b'},{id:'c'}]},snapshot=JSON.stringify(exercise);
  assert.deepEqual(orderChoices(exercise),orderChoices(exercise));
  assert.deepEqual(orderChoices(exercise).map(o=>o.id).toSorted(),['a','b','c']);
  assert.equal(JSON.stringify(exercise),snapshot);
  const chinese={...exercise,options:exercise.options.map(o=>({...o,text:{zh:'译文'}}))};
  assert.deepEqual(orderChoices(exercise).map(o=>o.id),orderChoices(chinese).map(o=>o.id));
});

test('the same answer ID does not always appear in one catalogue-wide position',()=>{
  const positions=new Set();
  for(let i=0;i<30;i++)positions.add(orderChoices({id:`module.C01.${i}`,options:[{id:'a'},{id:'b'},{id:'c'}]}).findIndex(o=>o.id==='b'));
  assert.equal(positions.size,3);
});
