import {lessons as math} from './math.mjs';
import {lessons as science} from './science.mjs';
import {lessons as computing} from './computing.mjs';
import {outlines as baseOutlines} from './module-outlines.mjs';
import {titles as baseTitles} from './module-titles.mjs';
import * as expandedMath from './expanded-math.mjs';
import * as expandedScience from './expanded-science.mjs';
import * as expandedComputing from './expanded-computing.mjs';
import {enrichLinearLesson} from './math-detail-overrides.mjs';

const packs=[expandedMath,expandedScience,expandedComputing];
export const lessons=[...math,...science,...computing,...packs.flatMap(p=>p.lessons)].map(enrichLinearLesson).map(l=>({...l,coverage:l.id.startsWith('module.')?'introductory-module-chapter':'focused-lesson',editorialStatus:'review-pending'}));
export const outlines=Object.assign({},baseOutlines,...packs.map(p=>p.outlines));
export const titles=Object.assign({},baseTitles,...packs.map(p=>p.titles));
export {goals} from './course-goals.mjs';
