# Teaching specification and lesson specimens

Design proposal · 28 September 2026. The examples below are original teaching specimens. They illustrate the intended depth and feedback, not a completed course library or learner assessment.

## 1. The lesson contract

Lessons are small enough to study in one sitting, but a difficult proof or experiment can span several sessions. Estimated reading time must not include an unsupported claim about how long mastery takes.

Each published lesson contains:

| Part | Required content |
|---|---|
| Objective | An observable skill, such as “decide whether two vectors are independent and justify the decision” |
| Entry check | Named prerequisite concepts, two short checks, and links to repair gaps |
| Concept | A precise definition or model, notation, assumptions, and at least one nonexample |
| Explanation | Derivation, proof, or mechanism; each substantive step has a reason |
| Examples | A straightforward example and one that exposes a common misconception |
| Interaction | A diagram, parameter experiment, construction, or code trace when educationally useful |
| Practice | Retrieval, routine application, misconception diagnosis, and transfer |
| Hints | Nudge → relevant concept → partial setup → next step → complete solution |
| Feedback | Answer conditions, worked solution, common-error responses, and assessment provenance |
| Review | A fresh delayed question, concept summary, and connections |

Difficulty is described by the reasoning required, not merely large numbers or a prestigious contest label. Problem metadata records whether a learner must recall, compute, model, prove, design, or synthesize. Avoid assuming all subjects share one scalar difficulty scale.

## 2. Full specimen: linear independence / 线性无关

**Course:** M09 Linear algebra I. **Module:** M09.02, Vectors, span and independence. **Context:** real vectors in R²; scalar arithmetic over the real numbers. **Objective:** determine whether a small list of vectors is independent and explain what the conclusion means.

**Prerequisites:** vector addition and scalar multiplication; solving two linear equations. A learner need not know determinants, eigenvalues, or abstract vector spaces yet.

### Entry check

1. Compute `2(1,2) − (2,4)`. Answer: `(0,0)`.
2. Solve `a + b = 0`, `a − b = 0`. Answer: `a = b = 0`.

If either is unclear, offer the relevant vector-arithmetic or elimination bridge before proceeding.

### Motivation

**English.** Two arrows may look different while pointing along the same line. If one is a multiple of the other, it contributes no new direction to the combinations you can form. Independence makes this idea precise.

**中文。** 两个向量即使长度不同，也可能位于同一条过原点的直线上。如果其中一个是另一个的倍数，它就没有为线性组合增加新的方向。“线性无关”把这个想法变成了严格的定义。

### Definition, including the quantifier

**English.** A list of vectors `v₁,…,vₖ` is linearly independent if the equation

`a₁v₁ + ··· + aₖvₖ = 0`

has only the solution `a₁ = ··· = aₖ = 0`. It is linearly dependent if there exists a solution in which **at least one coefficient is nonzero**. The word “only” is essential: the all-zero coefficients always give the zero vector.

**中文。** 向量组 `v₁,…,vₖ` 线性无关，是指方程

`a₁v₁ + ··· + aₖvₖ = 0`

只有 `a₁ = ··· = aₖ = 0` 这一组解。如果存在一组解，其中**至少一个系数不为零**，这个向量组就线性相关。“只有零解”中的“只有”不能省略，因为系数全为零时，等式总是成立。

### Worked example A: dependence

Let `u = (1,2)` and `v = (2,4)`. Then `2u − v = (0,0)`. The coefficients `2` and `−1` are not both zero, so the vectors are dependent. Every combination is `(a + 2b)(1,2)`; their span is one line.

设 `u = (1,2)`，`v = (2,4)`。因为 `2u − v = (0,0)`，且系数 `2`、`−1` 不全为零，所以它们线性相关。任意线性组合都可以写成 `(a + 2b)(1,2)`，因此它们张成的是一条直线。

**Misconception:** different vectors need not be independent. Also, dependence does not require every coefficient in a relation to be nonzero.

**易错点：** “两个向量不相同”不等于“它们线性无关”；线性相关也不要求某个关系式中的所有系数都非零。

### Worked example B: independence

Let `u = (1,2)` and `w = (3,1)`. To decide independence, start from `au + bw = 0`. Comparing coordinates gives

`a + 3b = 0` and `2a + b = 0`.

Twice the first equation minus the second gives `5b = 0`, so `b = 0`, then `a = 0`. Thus the pair is independent. We proved a statement about **all** coefficient pairs by solving the system; merely trying several pairs would not establish independence.

设 `u = (1,2)`，`w = (3,1)`。从 `au + bw = 0` 出发，比较两个坐标，得到 `a + 3b = 0`、`2a + b = 0`。第一个方程的两倍减去第二个方程，得到 `5b = 0`，所以 `b = 0`，再得 `a = 0`。因此这个向量组线性无关。这里求出了方程的全部解，而不是只尝试了几组系数。

### Interactive family

Use `u = (1,0)` and `v = (1,t)`. The learner changes `t` and sees the span as a line when `t = 0` or the whole plane when `t ≠ 0`. The vectors should move smoothly, but their mathematical values are displayed exactly as the chosen decimal parameter.

Algebra explains the picture: `a(1,0) + b(1,t) = (a+b, bt)`. If `t ≠ 0`, `bt = 0` forces `b = 0`, and then `a = 0`. If `t = 0`, choose `a = 1, b = −1`. Consequently the pair is independent **if and only if `t ≠ 0`**.

取 `u = (1,0)`、`v = (1,t)`。由于 `a(1,0) + b(1,t) = (a+b, bt)`，当 `t ≠ 0` 时，`bt = 0` 推出 `b = 0`，进而 `a = 0`；当 `t = 0` 时，可以取 `a = 1`、`b = −1`。所以两向量线性无关的充要条件是 `t ≠ 0`。动态图帮助观察，代数推导负责证明。

**Later connection:** two vectors can be mathematically independent while almost parallel. That numerical-conditioning issue belongs to M26; the app should not confuse “small nonzero” with “exactly zero.”

### Practice and feedback

| Task | Answer and required reasoning | Feedback for a common error |
|---|---|---|
| Are `(2,1)` and `(4,2)` independent? | No; `2(2,1) − (4,2) = 0` is a nontrivial relation. | Different lengths do not imply different directions. |
| Can a list containing the zero vector be independent? | No. Give its coefficient 1 and all other coefficients 0. | Independence forbids every nontrivial zero combination, including this one. |
| Are `(1,1)` and `(1,−1)` independent over R? | Yes. The coordinate equations imply both coefficients are zero. | The scalar field is part of the problem; do not silently change it. |
| Write `(5,3)` using `(1,0)` and `(1,1)`. Is it unique? | `2(1,0)+3(1,1)`; uniqueness follows from independence. | Subtract two supposed representations to get a zero combination. |
| Must three vectors in R² be dependent? | Yes. A homogeneous system with two equations and three unknown coefficients has a free variable after elimination. | A diagram suggests the answer, but elimination supplies the argument. |

中文练习界面使用相同题目、相同数学对象和同一题目 ID。关键术语固定为：线性组合 linear combination、张成空间 span、线性无关 linear independence、非平凡解 nontrivial solution。完整题面与反馈的双语审校是发布要求。

### Hint ladder for the representation problem

1. Write the unknown coefficients as `a` and `b`.
2. Expand `a(1,0)+b(1,1)` coordinate by coordinate.
3. The second coordinate gives `b = 3`.
4. The first coordinate gives `a+b = 5`.
5. Full answer: `a = 2, b = 3`. For uniqueness, subtract two representations and use independence.

Showing a hint changes the attempt to assisted practice. Reading these supplied solutions is not independent evidence.

### Acceptance and review

Use fresh examples with different values: one dependent and one independent pair, an explanation of “not all zero,” and a later transfer question about uniqueness of coordinates. Automatically checked coefficient answers can support objective skill evidence. The explanation is rubric/self-assessed unless a supported structured response is used. A delayed check must use a new problem, not the example already displayed.

## 3. Physics specimen: static friction is not always μN

**Course:** P01. **Objective:** decide whether a block moves before choosing a friction law. **Assumptions:** a 2.0 kg block starts at rest on a fixed plane; uniform gravity `g = 9.8 m/s²`; no other forces; `μs = 0.70`, `μk = 0.20`.

The model gives `N = mg cos θ`, and static friction adjusts as needed up to `|fs| ≤ μsN`. Kinetic friction has magnitude `μkN` when sliding, opposite relative motion. Replacing static friction with `μsN` in every situation is a model error.

At `θ = 30°`, the downhill component is `mg sin θ = 9.8 N`. The maximum static friction is about `11.88 N`. Since 9.8 N is below that maximum, the block remains at rest and the actual friction is **9.8 N uphill**, not 11.88 N.

At `θ = 45°`, `tan θ = 1 > μs`; static friction cannot maintain rest. Once it slides down, `a = g(sin θ − μk cos θ) ≈ 5.54 m/s²` downhill.

**Diagram:** free-body vectors are anchored to the block; a separate decomposition shows components along and normal to the plane. Changing the angle updates the force requirements and regime label. Do not animate sliding at angles where the model predicts rest.

**Practice:** at 20°, determine the actual friction; answer about 6.70 N uphill. Derive the critical angle `θc = arctan μs` for this initially resting model. Explain why mass cancels from the threshold.

**Checking:** numeric quantities require units and tolerances; the free-body diagram checks the specified forces and directions. An explanation checklist asks for a static-feasibility check before the kinetic calculation. Physical measurements may deviate because the ideal model assumes constant friction coefficients.

## 4. Chemistry specimen: weak-acid equilibrium and approximation

**Course:** C03. **Objective:** construct an equilibrium equation and verify an approximation. **Model:** a dilute ideal solution of a monoprotic acid HA at 25°C with analytical concentration `C = 0.100 mol/L`, `Ka = 1.00×10⁻⁵`; initially no added common ion. Use concentration-based activities as an approximation and neglect water autoionization after checking its scale.

For `HA ⇌ H⁺ + A⁻`, let `x` be the dissociated concentration. The concentration table gives `[HA] = C−x`, `[H⁺] ≈ x`, `[A⁻] = x`. Thus

`Ka = x²/(C−x)` and `x² + Ka x − Ka C = 0`.

The physically allowed root is

`x = (sqrt(Ka² + 4KaC) − Ka)/2 ≈ 9.950×10⁻⁴ mol/L`.

The concentration approximation to pH is `−log10(x/(1 mol/L)) ≈ 3.002`. This root is exact for the simplified equation, not for all real-solution effects.

If `x ≪ C`, `x ≈ sqrt(KaC) = 1.00×10⁻³ mol/L`. The inferred dissociation is about 1%, and the approximate x differs by about 0.50% from the quadratic result. It is also far above the pure-water hydrogen-ion scale of `10⁻⁷ mol/L`, supporting the neglect of water in this example. A “5% rule” can be taught as a convenient heuristic, not a theorem.

**Practice:** explain why dilution can invalidate the same simplification; predict the effect of adding the conjugate base; set up the mass and charge balance for a case where water cannot be neglected. Hints first request a species table, not a memorized square-root formula.

**Checking:** enforce `0 < x < C`, mass balance and dimensional consistency. A correct number obtained from an invalid approximation receives targeted feedback on the missing reasoning.

## 5. Biology specimen: inferring carrier frequency

**Course:** B02. **Objective:** distinguish a population model from a genotype observation. **Model:** a diploid population with two alleles A and a; assume Hardy–Weinberg genotype proportions at the locus, full penetrance of a recessive phenotype, and no phenocopies in the sample. State that empirical data may not satisfy these assumptions.

Let the allele frequencies be `p` and `q`, with `p+q=1`. Under the model, combining gametes gives `AA: p²`, `Aa: 2pq`, `aa: q²`.

If the recessive phenotype frequency is 0.09, then `q² = 0.09`, so `q = 0.30`, `p = 0.70`, and the carrier proportion is `2pq = 0.42`. The 0.09 phenotype frequency is a genotype-frequency inference under the stated model, not the allele frequency itself.

**Diagram:** a gamete-pair grid with row and column probabilities. The two heterozygote cells explain the factor 2. A data panel can compare expected counts with observed counts without implying that any discrepancy alone identifies its cause.

**Practice:** for `q = 0.20`, find the expected carrier proportion (0.32). Explain why the original phenotype frequency alone cannot establish the same carrier estimate if the equilibrium assumption fails. Propose data that would help check the model.

**Checking:** numeric model calculations can be exact; the model critique is a rubric with prompts for assumptions, sampling uncertainty, and alternative explanations. The app does not certify an arbitrary written interpretation automatically.

## 6. OI specimen: generalized Chinese remainder merging

**Course:** S08. **Objective:** derive one merge step before coding it. **Inputs:** normalized congruences `x ≡ R (mod M)` and `x ≡ r (mod m)`, with positive moduli. Known skills: gcd, extended Euclid, modular arithmetic, and integer overflow reasoning.

Write `x = R + Mt`. Substitution gives `Mt ≡ r−R (mod m)`. Let `g = gcd(M,m)`. There is a solution **if and only if** `g` divides `r−R`. The condition is essential when moduli are not coprime.

When solvable, divide by g. With `q = m/g > 1`, solve

`(M/g)t ≡ (r−R)/g (mod q)`.

The coefficient `M/g` is coprime to q, so it has an inverse modulo q. When q is 1, take `t = 0`; do not ask an inverse routine to handle that case implicitly. The merged modulus is `L = (M/g)m`, and the residue is `(R+Mt) mod L`, normalized into `[0,L)`.

**Example:** `x ≡ 2 (mod 6)`, `x ≡ 5 (mod 9)`. Here `g = 3`, and 3 divides the difference 3. Reduce to `2t ≡ 1 (mod 3)`, so `t ≡ 2 (mod 3)`. Hence `x ≡ 14 (mod 18)`.

**Nonexample:** replace the second residue by 4. Now 3 does not divide 2, so no solution exists.

**Implementation reasoning:** save the old M while calculating `R+Mt`; normalize negative remainders; specify what happens if the merged modulus exceeds the selected integer representation. Promote before multiplying. A wider type such as `__int128` only helps within its supported compiler and numeric range; it does not make arbitrary input sizes safe.

**Practice:** merge `x ≡ 3 (mod 4)`, `x ≡ 5 (mod 6)`; answer `x ≡ 11 (mod 12)`. Explain why the general answer uses an lcm rather than a product. Implement against a declared bound and compare small cases against exhaustive enumeration.

**Acceptance:** the learner must explain the gcd condition, derive a merge, handle inconsistent systems and modulus 1, and pass boundary tests. Sample tests alone cannot establish acceptance. The platform records derivation evidence separately from compilation, tests, and external-judge results.

## 7. Bilingual behavior

Interface and lesson language are independently selectable. Default to the same language, with a one-click toggle and an optional terminology side-by-side mode. Switching languages must preserve:

- Stable lesson, concept and exercise IDs.
- Mathematical notation, scientific constants, units, and constraints.
- Current step, answer text, selected diagram state, editor buffer, and hint history.
- Progress and review evidence.

English and Chinese variants are version-linked and reviewed together. A missing translation is an explicit fallback, never a blank lesson. Search indexes both languages and standard abbreviations. Notes remain exactly as the learner wrote them; switching the UI does not automatically translate or overwrite notes.

## 8. Checking, review and provenance rules

| Response | Offline checker | Limit |
|---|---|---|
| Integer/rational | Exact arithmetic | Must define accepted forms and overflow policy |
| Decimal with units | Unit normalization and explicit absolute/relative tolerance | Must handle zero scale, sign and significant-figure expectations |
| Algebraic expression | Restricted expression tree with domain assumptions | Sampling is diagnostic, not proof of an identity |
| Multiple choice | Authored answer plus distractor feedback | Correct selection alone is weak evidence of deep understanding |
| Geometry construction | Named constraints and numerical tolerances | A valid construction is not an arbitrary proof |
| Structured proof | Supported step rules and explicit premises | Scope is limited to authored proof forms |
| Free proof/explanation | Rubric and solution comparison | Self-assessed until independently reviewed |
| C++ program | Compiler, deterministic tests, validators and resource limits | Depends on test quality and declared toolchain; local result only |
| Experimental report | Structured data checks and rubric | Does not certify hands-on laboratory skill |

Every result stores checker type and version, problem revision, hint/reveal status, and whether assessment was automatic or self-assessed. Content errors can be flagged locally and corrected by a later pack without silently modifying historical evidence.

Review begins with simple transparent intervals, such as 1, 3, 7, 14, and 30 days, adjusted by independent recall and user preference. These are initial design heuristics, not validated personalized memory predictions. A missed day does not create a punitive backlog; offer a capped review session and let the learner rebalance it.

## 9. Content release gate

A lesson is ready only when its concept prerequisites resolve; every example and answer has been checked; theorem assumptions and model limitations are present; hints form a coherent ladder; independent problems are distinct from demonstrations; both language versions align; visual alternatives and keyboard access work; sources and license metadata are recorded; and unresolved editorial issues are visible.

For simulations, validate known cases, units, numerical stability, and the distinction between model and reality. For coding, validate generators and checkers independently where practical. For proofs, a finite sample check never substitutes for the reasoning.

This specification defines what construction must deliver. The course map, these specimens, and the interface preview do not constitute an expert-reviewed 90-course library.
