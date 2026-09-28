// Stable presentation avoids a catalogue-wide answer-position cue. IDs remain unchanged.
function hash(value){let result=2166136261;for(const character of value){result^=character.codePointAt(0);result=Math.imul(result,16777619);}result^=result>>>16;result=Math.imul(result,0x7feb352d);result^=result>>>15;return result>>>0;}
export function orderChoices(exercise){return [...(exercise.options??[])].sort((a,b)=>hash(exercise.id+'\0'+a.id)-hash(exercise.id+'\0'+b.id)||a.id.localeCompare(b.id));}
