// Original module-specific explanations for M20–M26. Independent expert review remains pending.
const B=(en,zh)=>({en,zh});
const details=new Map();
function D(id,en,zh,prompt,promptZh,answer,hint,hintZh,explanation,explanationZh){details.set(`module.${id}`,{body:B(en,zh),exercise:{id:`module.${id}.transfer-v2`,type:'numeric',prompt:B(prompt,promptZh),answer,tolerance:1e-8,hints:[B(hint,hintZh)],explanation:B(explanation,explanationZh)}});}
export function enrichAdvancedMathLesson(lesson){
 const d=details.get(lesson.id);if(!d)return lesson;
 return {...lesson,minutes:35,sections:lesson.sections.map((s,i)=>i===1?{type:'concept',title:B('Derivation, meaning, and boundaries','推导、意义与适用边界'),body:d.body}:s),exercises:[...lesson.exercises.filter(e=>e.id!==d.exercise.id),d.exercise]};
}

D('M20.01',`A cumulative distribution function F(x)=P(X≤x) is nondecreasing, right-continuous, and approaches zero and one at the two infinite ends. It exists for discrete, continuous, and mixed distributions. A probability density is a more restrictive representation: when X has density f, interval probabilities are integrals of f and F(x)=∫ from −∞ to x of f(t)dt. A single point then has probability zero, even though an interval containing it can have positive probability.

Density is probability per unit of the variable. Its height need not stay below one: a uniform distribution on [0,0.2] has density five but total area one. Changing measurement units changes density height while preserving probabilities. Where F is differentiable under the density assumptions, f=F′; do not assume that every distribution has an ordinary derivative density.

For a proposed f(x)=cx on [0,2] and zero elsewhere, normalization gives c∫₀²x dx=2c=1, hence c=1/2. Therefore P(1≤X≤2)=∫₁²x/2 dx=3/4. The support and nonnegativity conditions are checked before normalization. An antiderivative alone is insufficient if the proposed formula becomes negative on its support or its integral diverges.`, `分布函数F(x)=P(X≤x)单调不减、右连续，两端极限为0和1，离散、连续、混合分布都存在。密度是更特殊的表示：有密度f时区间概率为f积分，F是从负无穷积分到x。单点概率为0，但含它的区间可有正概率。

密度是每单位变量的概率，不要求高度≤1。[0,0.2]均匀密度5，总面积仍1。换单位改变密度高度而不变概率。在适当密度可微条件下f=F′，并非每个分布都具有普通密度。

若f(x)=cx定义于[0,2]、其余0，归一化得2c=1，所以c=1/2。P(1≤X≤2)=∫₁²x/2 dx=3/4。先查支持与非负；公式在支持上负值或积分发散时，有原函数也不够。`, 'A uniform variable on [2,7] has what probability of falling in [3,5]?','[2,7]均匀变量落在[3,5]的概率是多少？',0.4,'Divide interval length by total support length.','区间长除总支持长。','The density is 1/5 and the requested interval has length two, so probability is 2/5.','密度1/5，目标区间长2，概率2/5。');
D('M20.02',`A joint density f(x,y) assigns probability by integrating over regions in the plane. Marginalizing means integrating over all possible values of the unwanted coordinate. Independence requires the joint density to factor into the product of marginals almost everywhere; merely having zero covariance is not generally enough. A conditional density divides the joint by a positive marginal density and must be interpreted only where that denominator is meaningful.

A transformation stretches area or length, so its density needs a Jacobian factor. For an invertible differentiable transformation y=g(x), density at y equals the original density at g⁻¹(y) times the absolute determinant of the inverse derivative. The absolute value prevents an orientation reversal from producing negative probability. If the transformation is many-to-one, sum contributions from every valid inverse branch.

For X uniform on [−1,1] and Y=X², values 0<y<1 have inverse branches x=√y and x=−√y. Each contributes (1/2)/(2√y), giving density 1/(2√y). Its singular height near zero is integrable and its total integral is one. Ignoring the negative branch would lose half the probability. Always transform the support alongside the formula.`, `联合密度在平面区域积分给概率，边缘化对不要的坐标全部积分。独立要求联合密度几乎处处分解为边缘乘积，零协方差一般不够。条件密度以正边缘密度除联合，仅在分母有意义处使用。

变换伸缩长度面积，密度需雅可比。可逆可微y=g(x)时，新密度是旧密度在逆像值乘逆导数行列式绝对值；绝对值防方向反转造成负概率。多对一时要对全部合法逆分支求和。

X在[−1,1]均匀，Y=X²，0<y<1有±√y两支，各贡献1/(4√y)，合1/(2√y)。近零无界却可积，总积分1，漏负支会丢半概率。公式与支持必须一起变换。`, 'X is uniform on [0,2] and Y=3X+1. What is the density of Y inside its support?','X在[0,2]均匀，Y=3X+1，Y在支持内部密度是多少？',1/6,'The support length is multiplied by three.','支持长度乘3。','Y is uniform on [1,7], length six, so its density is 1/6.','Y在[1,7]均匀，长度6，密度1/6。');
D('M20.03',`The law of large numbers concerns stabilization of sample averages. For independent identically distributed observations with a finite mean, an appropriate law says the average approaches that population mean in a specified convergence sense. It does not say that every new observation approaches the mean, or that successive averages improve monotonically. Random fluctuations can temporarily move an estimate farther away.

The classical central limit theorem concerns a different object: if the observations also have finite positive variance σ², then √n(Xbar−μ)/σ approaches a standard normal distribution. Thus typical sample-mean fluctuations scale like σ/√n. The theorem describes a limiting approximation, not exact normality at every sample size, and strongly skewed or heavy-tailed distributions can require careful finite-sample assessment.

For independent observations with standard deviation ten, averaging twenty-five gives standard error two, while averaging one hundred gives standard error one. Four times the observations halve this uncertainty. If observations are correlated, covariance terms enter the variance of their sum, so dividing by √n without justification can understate uncertainty. Infinite-variance distributions lie outside the elementary CLT’s hypotheses. State both the sampling assumptions and the particular theorem before interpreting a bell-shaped histogram.`, `大数定律研究样本均值稳定。独立同分布且有限均值下，适当定律保证均值以规定收敛意义趋总体均值；不说每个新观察趋均值，也不说连续估计单调变好，波动可暂变差。

经典中心极限定理另研究标准化波动：若还有有限正方差σ²，√n(Xbar−μ)/σ趋标准正态，因此典型均值波动σ/√n。这是极限近似，不是每个n精确正态，偏斜重尾有限样本需谨慎。

标准差10的独立样本，n=25标准误2，n=100为1，四倍样本减半误差。相关时和的方差有协方差项，未经证明直接除√n可能低估。无限方差不满足初等CLT前提，看钟形直方前应说明抽样假设与定理。`, 'Independent observations have standard deviation 15. What is the standard error of their mean for n=25?','独立观察标准差15，n=25的均值标准误是多少？',3,'Use σ/√n.','用σ/√n。','15/√25=15/5=3.','15/5=3。');
D('M20.04',`An estimator is a rule that maps observed data to a parameter estimate. Its bias is the difference between its expectation and the target parameter, while variance describes fluctuations across repeated samples. Mean squared error combines variance and squared bias when these quantities exist. An unbiased estimator need not be precise, and a slightly biased estimator can have smaller overall squared error.

A confidence interval is also a data-dependent rule. A ninety-five-percent procedure covers the fixed true parameter in ninety-five percent of repeated samples under its assumptions. After one interval is calculated, the frequentist statement does not assign a new probability distribution to that fixed parameter. Bayesian credible intervals answer a different conditional-probability question and require a prior model.

For a normally distributed sample with known population standard deviation, the mean interval uses Xbar±zσ/√n. If the standard deviation is estimated from a small normal sample, the Student t quantile accounts for extra uncertainty. Wider confidence levels and smaller samples generally widen intervals. An interval for one future observation is wider than an interval for the mean because it includes individual outcome variation. Check independence, sampling design, and the actual inferential target before choosing a familiar formula.`, `估计量是从数据到参数估计的规则。偏差为期望减目标，方差为重复样本波动；存在时均方误差=方差+偏差平方。无偏未必精确，略有偏可能总平方误差更小。

置信区间也是数据规则。95%程序在假设下重复抽样95%覆盖固定真参数；算出一个区间后，频率解释并非给固定参数新的概率分布。贝叶斯可信区间是另一个条件概率问题且需先验。

正态已知总体标准差，均值区间Xbar±zσ/√n。小正态样本估标准差时用t分位反映额外不确定。高置信或小样本通常更宽。预测单个未来观察比估均值更宽，因为还含个体波动。套公式前查独立、抽样设计、推断目标。`, 'An estimate is 20 with standard error 1.5. Using multiplier 2, what is the interval half-width?','估计20、标准误1.5，乘数2时区间半宽多少？',3,'Multiply the standard error by the chosen multiplier.','标准误乘给定倍数。','2×1.5=3, giving the approximate interval [17,23].','半宽3，近似区间[17,23]。');
D('M20.05',`A hypothesis test starts with a null model, an alternative, and a statistic whose distribution under the null can be characterized. A p-value is the probability under that null model of results at least as extreme according to the chosen rule. It is not the probability that the null is true and not the probability that the result occurred by chance in an unspecified sense.

The significance level α controls type I error for the stated procedure: rejecting a true null. Type II error means failing to reject under a specified alternative; power is one minus that error probability. Power depends on effect size, sample size, variability, and the decision rule. A nonsignificant result can reflect insufficient information rather than evidence that the effect is exactly zero.

Choose one-sided or two-sided testing from the scientific question before examining the observed direction. Testing many outcomes and reporting only the smallest p-value inflates false-positive risk unless multiplicity is handled. Random assignment helps address confounding, while random sampling addresses population representation; they are not interchangeable. Report effect estimates and uncertainty alongside a decision threshold, because a tiny p-value can accompany a practically negligible effect in a very large dataset.`, `检验先定零模型、备择和零模型下分布可知的统计量。p值是零模型下按指定规则至少同极端结果的概率，不是零假设为真概率，也不是模糊意义“偶然发生概率”。

α控制规定程序的第一类错误：拒真零假设。第二类是某备择下未拒绝，功效为1减此概率，依效应、样本、变异、规则。未显著可能信息不足，不能证明效应恰零。

看方向前依科学问题选单或双侧。多指标只报最小p会增假阳性，须处理多重性。随机分配处理混杂，随机抽样处理总体代表，不可互换。阈值旁还报效应及不确定，因为巨样本下微小实际效应也可极小p。`, 'A two-sided z test compares estimate 18 with null 12 using standard error 3. What is z?','双侧z检验估计18、零值12、标准误3，z多少？',2,'Standardize the estimate-minus-null difference.','估计减零值再除标准误。','(18−12)/3=2. This is a statistic, not a posterior probability.','(18−12)/3=2，是统计量，不是后验概率。');
D('M20.06',`Regression specifies how an outcome distribution or conditional mean depends on predictors. Least squares selects coefficients minimizing squared residuals, where a residual is observed minus fitted value. The resulting coefficients describe the specified model and data; without a causal design they do not automatically measure intervention effects. Correlated predictors can make individual coefficient estimates unstable even when predictions remain useful.

Residual plots test whether important structure remains unexplained. Curvature suggests a missing nonlinear component, changing spread suggests heteroskedasticity, and ordered patterns suggest dependent errors. Diagnostics are clues requiring interpretation rather than mechanical proof that one replacement model is correct. Evaluate predictive performance on data not used for fitting or tuning to expose overfitting.

The ordinary bootstrap repeatedly samples observations with replacement from the empirical dataset and recomputes the statistic. Its spread approximates sampling uncertainty under suitable conditions. Resampling individual rows assumes the relevant independence structure; time series or clustered samples may need block or cluster resampling. Bootstrap does not create new information, repair a biased sample, or guarantee accurate inference for every nonsmooth or boundary statistic. Record the resampling unit, number of repetitions, and interval construction so the uncertainty claim can be reproduced.`, `回归规定结果分布或条件均值与特征关系。最小二乘最小化残差平方，残差是观察减拟合。系数描述指定模型数据，无因果设计不自动代表干预效应。相关特征可使单个系数不稳，即使预测有用。

残差弯曲暗示漏非线性，散布变化暗示异方差，有序模式暗示依赖。诊断是待解释线索，不机械证明替代模型。用未参与拟合调参数据评预测，暴露过拟合。

普通bootstrap对经验样本有放回重抽并重算统计量，在适当条件下近似抽样不确定。逐行抽隐含相关独立结构，时间序列或聚类可能需块或簇重抽。它不创造信息、不修有偏样本，也不保证所有非光滑边界统计准确。记录重抽单位、次数和区间构造以复现。`, 'Observed values are [2,5] and predictions are [3,3]. What is the mean squared error?','观察[2,5]、预测[3,3]，均方误差多少？',2.5,'Square each residual before averaging.','残差各平方再平均。','Residuals are −1 and 2, so MSE=(1+4)/2=2.5.','残差−1、2，所以(1+4)/2=2.5。');

D('M21.01',`An inequality compares two quantities over a stated domain. Before transforming it, record sign restrictions: multiplying by a positive number preserves order, multiplying by a negative number reverses it, and multiplying by zero can erase information. Squaring both sides is reversible only with suitable nonnegativity conditions. Equality cases belong to the theorem and often reveal the structure of the sharp bound.

A common proof strategy moves everything to one side and expresses the difference as a sum of nonnegative terms. For a²+b²≥2ab, the difference is (a−b)², valid for every real a,b. Equality is therefore equivalent to a=b, not merely suggested by testing equal inputs. This identity also proves |a+b|²≤2(a²+b²), a useful bound on sums.

To estimate a complicated expression, distinguish an upper bound from a value that is actually attainable. Several individually valid inequalities can produce a bound whose equality requirements cannot all hold simultaneously. Such a bound remains valid but may not be optimal. Check sharpness by solving all equality conditions together or by constructing a sequence approaching the claimed constant. A numerical search can suggest a candidate but does not replace an argument covering the full domain.`, `不等式在规定域比较两量。变形前记符号：乘正保持、乘负反向、乘零可能丢信息；平方要有适当非负条件才等价。等号是定理一部分，常揭最优界结构。

可移项写非负和。a²+b²≥2ab的差为(a−b)²，对全部实数成立，等号恰a=b，不只是试相等猜出。该恒等式也推|a+b|²≤2(a²+b²)。

复杂估计需区分上界和可达到值。连续用若干正确不等式，等号要求可能不能同时满足，界仍真却不一定最优。应联立等号或构造逼近序列验证尖锐性。数值搜索只能启发候选，不能覆盖全域证明。`, 'For a=5 and b=2, what is the gap a²+b²−2ab?','a=5、b=2时a²+b²−2ab差多少？',9,'Use the square of the difference.','用差的平方。','(5−2)²=9, confirming nonnegativity.','(5−2)²=9，证非负。');
D('M21.02',`For two nonnegative numbers, the arithmetic mean is at least the geometric mean because (√a−√b)²≥0 expands to a+b≥2√ab. Equality holds precisely when a=b. The nonnegative domain matters: an arbitrary real square root may not exist for negative inputs, and changing signs can invalidate a product argument.

The n-variable version states that the average of nonnegative numbers is at least the nth root of their product. Weighted AM-GM uses nonnegative weights summing to one: Σwᵢaᵢ≥∏aᵢ^wᵢ for positive inputs, with zero cases handled by limits where meaningful. For strictly positive weights, equality requires all corresponding inputs equal. One proof applies the concavity of log and then exponentiates, linking elementary inequalities to convex analysis.

With a+b+c=15 and positive variables, AM-GM gives abc≤5³=125, attained at a=b=c=5. For unequal coefficients, first choose a substitution or weights matching the constraint. Applying an unweighted formula to weighted terms without tracking the product’s coefficient can lose the desired constant. Normalize homogeneous expressions when useful, but verify that the normalized domain still permits the equality configuration.`, `双非负数AM-GM来自(√a−√b)²≥0，展开a+b≥2√ab，等号恰a=b。非负域重要，负输入根号可能无实意义，符号变化可毁乘积推理。

n元平均≥积的n次根。权非负且和1时，正输入有Σwᵢaᵢ≥∏aᵢ^wᵢ，零情况适当以极限处理。正权等号要求对应输入全等，可由log凹性证明再指数化，连接凸分析。

a+b+c=15时abc≤125，等号各5。系数不等时先选匹配约束的代换或权，直接对加权项套等权而忘乘积系数会错常数。齐次可规范化，但仍需允许等号配置。`, 'Positive a,b satisfy a+b=18. What is the largest possible product ab?','正a,b满足a+b=18，ab最大多少？',81,'The product is largest when the two inputs are equal.','两者相等时积最大。','AM-GM gives ab≤(18/2)²=81, attained at a=b=9.','ab≤9²=81，a=b=9达到。');
D('M21.03',`Cauchy–Schwarz bounds a dot product by the product of lengths. For real vectors a,b, consider the nonnegative quadratic Σ(aᵢ−tbᵢ)² in t. Its discriminant cannot be positive when b is nonzero, giving (Σaᵢbᵢ)²≤(Σaᵢ²)(Σbᵢ²). Equality means one vector is a scalar multiple of the other; zero vectors are included separately without dividing by their length.

An important rearranged form is Σxᵢ²/yᵢ≥(Σxᵢ)²/(Σyᵢ) for positive yᵢ. Apply Cauchy to xᵢ/√yᵢ and √yᵢ. Equality requires xᵢ/yᵢ to be constant. This form is useful for fractions because the denominators remain visible in the equality condition.

Hölder generalizes the relation between exponents: Σ|aᵢbᵢ|≤(Σ|aᵢ|^p)^(1/p)(Σ|bᵢ|^q)^(1/q) when p,q>1 and 1/p+1/q=1. The exponents are conjugate, not arbitrary. At p=q=2 it becomes Cauchy. Track absolute values and finite sums before extending to integrals or infinite series, where integrability and convergence become additional requirements. Choosing the right factorization is usually the main problem-solving step.

For p=3, conjugacy gives q=3/2. If either norm vanishes, every entry of that vector is zero and the inequality follows directly; division by that norm would be invalid. For nonzero vectors, equality in Hölder requires their pth and qth absolute powers to be proportional. This equality test helps determine whether a proposed numerical bound is attainable.`, `柯西把点积界于长度积。非零b时考虑对t非负的二次式Σ(aᵢ−tbᵢ)²，其判别式≤0，得(Σaᵢbᵢ)²≤Σaᵢ²Σbᵢ²。等号为成比例，零向量另处不除长度。

正yᵢ时有Σxᵢ²/yᵢ≥(Σxᵢ)²/Σyᵢ，对xᵢ/√yᵢ与√yᵢ用柯西，等号要求xᵢ/yᵢ常数，分式题尤其有用。

赫尔德为Σ|aᵢbᵢ|≤(Σ|aᵢ|^p)^(1/p)(Σ|bᵢ|^q)^(1/q)，p,q>1且1/p+1/q=1，指数不能任取，p=q=2回到柯西。推广积分无穷级数还需可积收敛，必须保绝对值和条件。解题难点常在选择分解。

p=3时共轭指数q=3/2。若一个范数为零，对应向量每个分量为零，不等式直接成立，不能除以该范数。非零向量的赫尔德等号要求各分量绝对值的p次方与q次方成比例。这能检验数值界是否真正可达到。`, 'For positive x,y with x+y=10, what is the minimum of x²/2+y²/3?','正x,y且x+y=10，x²/2+y²/3最小多少？',20,'Use the fraction form of Cauchy with denominators two and three.','用分母2和3的柯西分式形式。','The bound is 10²/(2+3)=20, attained at x/2=y/3, namely x=4,y=6.','下界100/5=20，x/2=y/3即x=4,y=6达到。');
D('M21.04',`A function on a convex domain is convex when the value at a weighted average of two points does not exceed the weighted average of their values. Geometrically, its graph lies below each connecting chord. Repeatedly combining points gives Jensen’s inequality for finitely many nonnegative weights summing to one. This proof explains why both the domain and the weights matter.

For a twice differentiable real function on an interval, nonnegative second derivative implies convexity. This is a sufficient test convenient for x² or the exponential, but convex functions need not be differentiable everywhere: |x| has a corner and is still convex. Strict convexity makes equality in Jensen force all positively weighted inputs to coincide, while merely convex functions can have entire affine regions of equality.

For weights 1/4 and 3/4 applied to values zero and four, the weighted mean is three. Squaring it gives nine, while the weighted mean of squares is twelve. The gap is the weighted variance, illustrating how Jensen measures spread for the square function. Reverse the inequality for concave functions, such as log on positive numbers. Never determine the direction by the name of the inequality alone; inspect the curvature on the actual domain.`, `凸函数在凸域中满足两点加权平均处值≤值的加权平均，图像在弦下。反复组合得有限非负和1权的Jensen，说明域与权必要。

区间二次可微且二阶导非负足以凸，适合平方指数，但凸未必处处可微，绝对值有角仍凸。严格凸使等号要求正权输入全等，一般凸的仿射段可有更多等号。

0和4配1/4与3/4，均值3平方9，平方均值12，差是加权方差，说明平方Jensen衡量离散。正域log等凹函数方向反转，必须查实际域曲率，不能只凭名称记方向。`, 'Equal weights on values 2 and 6 give what Jensen gap for f(x)=x²: average squares minus square of average?','2和6等权，平方Jensen差“平方平均减平均平方”是多少？',4,'Compute (4+36)/2−4².','算(4+36)/2−4²。','20−16=4. The nonnegative gap reflects convexity.','20−16=4，非负差体现凸性。');
D('M21.05',`The rearrangement inequality compares pairings of two sorted real sequences. If a≤b and c≤d, pairing similarly instead of oppositely changes the sum by ac+bd−ad−bc=(b−a)(d−c)≥0. Repeatedly removing inversions proves that similarly sorted pairing maximizes the total, while opposite order minimizes it. The two-variable swap supplies the proof mechanism rather than merely an example.

Smoothing replaces selected variables by simpler ones while preserving a constraint. Under a fixed sum, replacing a,b by their average decreases a²+b² and increases ab. That conclusion follows from their difference squared. For a more complicated expression, check all terms affected by the replacement; symmetry alone does not prove that averaging improves the objective.

Substitutions can encode a constraint automatically. Positive a,b,c that are side lengths of a nondegenerate triangle can be written a=x+y,b=y+z,c=z+x for positive x,y,z, where x=(a+c−b)/2 and similarly for the others. Triangle inequalities ensure positivity. Such a substitution converts geometric feasibility into a positive-variable domain, but arbitrary triples not satisfying triangle inequalities cannot use it. Track reversibility so a transformed proof covers exactly the intended configurations.`, `排序不等式来自双变量交换：a≤b、c≤d时同序减反序=(b−a)(d−c)≥0，反复去逆序证明同序最大反序最小，交换是机制而非只举例。

磨光保持约束而简化变量。固定和下a,b换平均减少平方和、增加积，由差平方推出。但复杂式须查全部受影响项，单有对称不能证明平均更好。

代换可自动编码约束。非退化三角形正边可写a=x+y,b=y+z,c=z+x，x=(a+c−b)/2等均正，由三角不等式保证。它把几何可行变为正变量域，任意不成三角形三元组不能用。需追踪可逆性以覆盖恰好目标配置。`, 'Pair [1,4] with [2,5]. What is the maximum paired sum?','[1,4]与[2,5]配对，乘积和最大多少？',22,'Use the same sorted order.','使用同排序。','1×2+4×5=22; the opposite pairing gives 13.','同序2+20=22，反序5+8=13。');
D('M21.06',`A symmetric expression is unchanged by permuting its variables, while a homogeneous expression scales by a fixed power when every variable is scaled together. Homogeneity permits normalization, such as a+b+c=1, only when the scaling factor is legitimate and the original domain is preserved. After proving the normalized inequality, restore the appropriate degree to recover the general statement.

For nonnegative a,b,c, the inequality (a+b+c)²≥3(ab+bc+ca) follows because the difference equals half the sum of the three squared pairwise differences. Equality requires a=b=c. With fixed sum s, this bounds ab+bc+ca by s²/3. Separately, AM-GM bounds abc by (s/3)³; these are different symmetric quantities and need different degree bookkeeping.

Geometric inequalities bring feasibility conditions from the figure. For triangle side lengths, positivity alone is not enough; each side must be less than the sum of the others. An equality configuration may be an equilateral triangle, a limiting degenerate triangle, or impossible within the strict domain. Distinguish a maximum attained inside the domain from a supremum approached at its boundary. A diagram can suggest where equality occurs, but algebra or a geometric argument must verify both the bound and the feasibility of that case.`, `对称式置换不变，齐次式全变量缩放按固定幂变。齐次可规范如和1，但缩放必须合法并保域，证明后按次数还原。

非负a,b,c有(a+b+c)²≥3(ab+bc+ca)，差为三对差平方和一半，等号全等。因此和s时二次对称和≤s²/3；AM-GM另给abc≤(s/3)³，不同次数需分别记账。

几何还有图形可行条件，三边仅正不够，需每边小于其余和。等号可能正三角、退化极限或严格域内不可能。要区分内部达到最大和边界逼近上确界。图可猜等号，但需代数或几何证界与配置可行。`, 'Nonnegative a,b,c sum to 9. What is the largest possible ab+bc+ca?','非负a,b,c和9，ab+bc+ca最大多少？',27,'Use the squared-sum bound and inspect equality.','用平方和界并查等号。','The upper bound is 9²/3=27, attained at a=b=c=3.','上界81/3=27，三者各3达到。');

D('M22.01',`A functional equation constrains an unknown function at many inputs simultaneously. Start by recording domain and codomain, then choose substitutions that simplify or connect values: zero, equal inputs, additive inverses, or values making a coefficient vanish. Each substitution gives a necessary consequence; a proposed final formula must still be substituted into the original equation to prove sufficiency.

For an additive function f(x+y)=f(x)+f(y), substituting zero gives f(0)=0, and y=−x gives f(−x)=−f(x). Repeated addition yields f(nx)=nf(x) for integers n. On rational inputs, f(p/q)=p f(1)/q follows by multiplying the input by q. This establishes linearity over the rationals without assuming continuity.

On the real numbers, concluding f(x)=cx needs a regularity hypothesis such as continuity at one point, monotonicity, or an appropriate measurability condition. Without such a hypothesis, nonstandard additive functions exist under usual choice-based constructions. In olympiad problems, extra conditions often supply the missing regularity or constrain the domain to integers or rationals. Never replace an everywhere quantified equation by agreement on a finite sample of inputs. Classify special cases such as f identically zero before dividing by a function value that could vanish.`, `函数方程同时限制许多输入，先定域陪域，再代0、相同、相反或使系数零的值以连接输出。代换只给必要条件，最终候选须代原式证充分。

可加式代0得f(0)=0，代相反得奇性，重复相加得整数n的f(nx)=nf(x)。有理p/q由乘q得f(p/q)=p f(1)/q，无连续假设即可有理线性。

实域要推出f(x)=cx需一点连续、单调或适当可测等正则。无此条件，通常选择构造下有非标准可加函数。竞赛附加条件常补正则或限制整有理域。有限样本不能替代全称方程，除以可能零的f值前先分恒零等特例。`, 'An additive function on the rationals satisfies f(1)=5. What is f(3/2)?','有理数上可加函数f(1)=5，f(3/2)多少？',7.5,'Use rational homogeneity.','使用有理齐次性。','f(3/2)=(3/2)f(1)=15/2.','f(3/2)=3/2×5=15/2。');
D('M22.02',`Number-theoretic constructions turn existence claims into explicit integers meeting every condition. Congruences can control local behavior, while divisibility and bounds control the whole object. The Chinese remainder theorem combines compatible residue requirements; for noncoprime moduli, compatibility must be checked modulo their gcd before constructing a solution. An expression that satisfies only some of the residues is not a completed construction.

For impossibility, reduce all candidate integers to a small collection of residue classes. Squares modulo eight are zero, one, or four: even integers split by divisibility by four, while (2k+1)²=4k(k+1)+1≡1 because k(k+1) is even. Therefore an equation requiring a square congruent to three modulo eight has no integer solution.

Infinite descent is another method: assume a positive solution exists, choose one minimizing a positive integer measure, then construct a smaller positive solution to the same problem. Every part matters. The new object must remain integral, satisfy the original conditions, and strictly reduce the measure. Merely making one coordinate smaller while another grows does not establish descent unless that coordinate was the chosen well-founded measure. A finite search can discover a pattern but cannot exclude unbounded integer solutions by itself.`, `数论构造把存在变成满足全部条件的整数。同余控局部，整除界控整体。CRT组合兼容余数，非互素先查gcd兼容；只满足部分条件不算完成。

不可能性可把所有整数分剩余类。平方模8为0、1、4，奇数(2k+1)²=4k(k+1)+1因相邻积偶而余1，偶数再按被4整除分。因此要求平方模8余3无整数解。

无穷递降假设正解，选某正整数度量最小者，再构同问题更小正解。新对象必须整数、满足原条件、严格降度量。只一坐标变小而另一增长不够，除非前者就是选定良基度量。有限搜索可发现模式，不能独自排除无界解。`, 'What is the remainder of every odd square modulo 8?','每个奇数平方模8余数多少？',1,'Write the odd integer as 2k+1.','写成2k+1。','Its square is 4k(k+1)+1, and k(k+1) is even, leaving remainder one.','平方4k(k+1)+1，相邻积偶，故余1。');
D('M22.03',`An invariant is a quantity unchanged by every legal operation. A monovariant moves only in one direction and can prove termination when its values cannot change that way forever. Choose the quantity from the operation’s structure, such as parity, a coloring count, a residue, or a weighted sum. Checking a few moves is not enough; prove preservation for an arbitrary legal move.

A domino covers one black and one white square on a checkerboard, so any tiled region has equal color counts. This necessary condition can prove impossibility but is not sufficient for every disconnected or irregular region. A coloring argument must therefore state exactly which direction of implication it supplies.

The extremal principle chooses an object minimizing or maximizing a quantity among a finite set. Its extremality imposes inequalities that an arbitrary choice would not possess. For example, a longest simple path in a finite graph cannot have an endpoint adjacent to a vertex outside the path, because that would extend it. The endpoint may still have neighbors elsewhere on the same path, so the argument does not imply degree one. Distinguish such precise consequences from stronger unsupported conclusions. Combining an extremal choice with an invariant often reveals a useful contradiction.`, `不变量每合法操作不变，单调量只一方向变化，若不可能永远变可证终止。依操作选奇偶、染色数、余类、加权和，需证任意合法操作，而非只试几步。

棋盘多米诺每次一黑一白，所以可铺区域黑白数相等，是必要非所有不规则区充分。染色必须说清蕴含方向。

极值原理在有限集选最小最大，使所选对象获得任意对象无的约束。有限图最长简单路端点不能邻接路外点，否则可延长；但仍可邻接路上其他点，所以不能推出度1。须区分精确结论与过强说法。极值结合不变量常产生矛盾。`, 'A checkerboard region has 17 black and 15 white squares. How many black squares would remain after hypothetically placing 15 nonoverlapping dominoes each covering one of each color?','区域17黑15白，假设放15个各盖一黑一白的不重叠骨牌，剩几黑？',2,'Subtract one black for each domino.','每骨牌减一黑。','17−15=2 black squares remain, showing that a complete domino tiling is impossible.','剩2黑，说明不可能全铺。');
D('M22.04',`Inversion centered at O with radius R maps every point P≠O to the same ray with OP′=R²/OP. It exchanges near and far points and is its own inverse. The center has no finite image. This is not an ordinary rigid motion: lengths and areas change, so a proof must translate the relevant geometric properties rather than assume distances are preserved.

A circle through O becomes a line not through O; a circle avoiding O becomes another circle. A line through O maps to itself, while a line avoiding O becomes a circle through O. These statements can be derived by substituting the inverse coordinate formula x′=R²x/(x²+y²), y′=R²y/(x²+y²) into the original line or circle equation.

Inversion preserves the magnitude of intersection angles away from O while reversing orientation in the real plane. This makes it useful for tangency problems, where a complicated family of tangent circles can become a simpler collection of lines and circles. Choose the center to simplify a distinguished intersection or tangency. Track excluded points and limiting configurations when translating the conclusion back. A line in the transformed figure may represent an original circle, so calling it an original straight segment would invalidate the reconstruction.`, `反演以O为心半径R，把非中心P送同射线OP′=R²/OP，交换远近且自身为逆，中心无有限像。它非刚体运动，长面积改变，需翻译性质不能假定距离保留。

过O圆变不过O直线，不过O圆变圆；过O直线自映，不过O直线变过O圆。可把逆坐标x′=R²x/(x²+y²)、y′同式代入线圆方程推得。

离O处交角大小保持，实平面定向反转，适合相切题，把圆族变简单线圆。选择中心简化特定交点切点，反推需跟踪排除点与极限。变换图直线可能原来是圆，不能误称原直线段。`, 'An inversion has radius 3 and a point is distance 12 from the center. What is its image distance?','反演半径3，点距中心12，像距多少？',0.75,'Use OP·OP′=R².','用两距离积等半径平方。','OP′=9/12=3/4.','像距9/12=3/4。');
D('M22.05',`A mathematical proof is a chain of implications from explicit assumptions to a conclusion. Proof repair begins at the first implication that is not justified, not necessarily the line where the final numerical answer becomes wrong. Identify whether the defect is an omitted case, an invalid converse, a domain error, circular reasoning, or an unjustified limiting step.

For example, from xy=0 one may conclude x=0 or y=0 over the real numbers, but from xy=xz one may cancel x only when x≠0. The x=0 case imposes no equality between y and z. A correct repair splits the cases or factors x(y−z)=0; adding a sentence at the end claiming y=z would not fix the logical gap.

Mixed olympiad problems often move between algebra, geometry, and number theory. Every translation needs a reversible map or a clearly stated one-way implication. Squaring an equation can introduce extraneous roots; applying a geometric construction may impose positivity; a modular obstruction may prove impossibility without constructing all solutions. Verify candidate answers in the original statement. A counterexample disproves a universal claim but does not automatically establish the best corrected theorem. State the repaired claim separately, then supply a complete argument for it.`, `证明是从明确假设到结论的蕴含链。修复找首个无依据推理，不一定找最后数值错处，判断漏情况、逆命题、域错、循环或极限无据。

实数xy=0可得x=0或y=0，但xy=xz仅x≠0可约x；x=0时y,z无必须相等。正确修复分情况或x(y−z)=0，末尾补一句y=z不修逻辑。

综合题跨代几数论，每翻译需可逆或明确单向。平方可增根，几何构造需正，同余障碍可证无解却不枚举所有解。候选须验原题。反例推翻全称不自动建立最好修正版，应另述修正主张并完整证明。`, 'For real x, the equation x²=5x has how many distinct solutions?','实数方程x²=5x有几个不同解？',2,'Factor before canceling a possibly zero x.','先因式分解，别约可能零的x。','x(x−5)=0 gives x=0 and x=5. Dividing by x would lose zero.','x(x−5)=0得0、5，直接约x会漏0。');
D('M22.06',`Timed practice measures the interaction of understanding, discovery, execution, and checking under a fixed budget. Record when the key idea appeared, where a proof stalled, and which assumptions were overlooked. A final score alone cannot distinguish a conceptual gap from a correct idea implemented too slowly or an unchecked sign mistake.

After the timed attempt, reconstruct the decisive argument without looking at the solution. Explain why its main invariant, substitution, or extremal choice was useful. Then alter one condition and determine which proof step changes. This transfer exercise distinguishes a remembered pattern from understanding of the mechanism. For a parity proof, changing one odd summand to even changes the final residue class; simply repeating the original conclusion would reveal superficial recall.

Maintain an error record organized by cause, such as missing equality cases, invalid cancellation, or unjustified symmetry. Choose a short targeted set that isolates the cause, then return to a mixed problem where the technique is not named. Keep assisted reconstruction separate from independent solving evidence. Both support learning, but only the latter demonstrates unaided retrieval under the stated conditions. Revisit after a delay and preserve the original attempt so later improvement is measured honestly rather than retroactively changing the contest result.`, `限时练习测理解、发现、执行、检查在固定预算的交互，记关键想法出现、证明卡点、漏假设。总分不能区分概念缺口、实现慢或未查符号。

结束后不看解重构关键论证，解释不变量、代换或极值为何有效，再改一条件看哪步变。这区分记套路与理解机制。如奇偶证明把一个奇数换偶数会改余类，重复旧结论说明浅记。

错误按漏等号、非法约分、无据对称等原因组织，先小专项隔离原因，再混合题不点名技巧。受助重构与独立解证据分开，二者都助学习，后者才展示无帮助提取。延后重做，保留原尝试诚实测改进，不倒改限时成绩。`, 'An odd integer plus two even integers has what remainder modulo 2?','一个奇数加两个偶数，模2余数多少？',1,'Add the residues of the three summands.','相加三项余数。','1+0+0≡1 mod 2, so the sum remains odd.','1+0+0余1，和仍奇。');

D('M23.01',`A complex derivative is one limit obtained while the increment approaches zero through every direction in the plane. This is stronger than taking a derivative along the real axis or checking two directional derivatives independently. If f is differentiable at z0, then f(z0+h)=f(z0)+f′(z0)h+o(|h|), so the first-order action is multiplication by one complex number.

Multiplication by a nonzero complex number simultaneously scales and rotates every direction by the same factors. A general real-linear map from the plane to itself can stretch two axes differently or reflect orientation; such a map need not be a complex derivative. For conjugation f(z)=conjugate(z), the difference quotient is one along real increments and minus one along imaginary increments, so no complex derivative exists anywhere.

A function is holomorphic on an open set when it is complex differentiable at every point there. Differentiability at one isolated point does not imply holomorphicity nearby. For f(z)=|z|², the quotient at zero is |h|²/h, whose magnitude is |h| and tends to zero, giving derivative zero. Away from zero, the required first-order map is not complex-linear. This contrast explains why open-set hypotheses are central to the powerful theorems of complex analysis.`, `复导数是增量从平面所有方向趋零的同一极限，比仅实轴或独立两个方向导数强。可微即f(z0+h)=f(z0)+f′(z0)h+o(|h|)，一阶作用是乘一个复数。

非零复数乘法各方向同缩放旋转，一般实线性平面映射可不同轴伸缩或反射，未必是复导。共轭函数沿实增量商1，虚增量商−1，因此处处不复可微。

开集每点可微叫全纯，孤立点可微不意味邻域全纯。|z|²在0商|h|²/h模为|h|趋0，导数0；别处一阶非复线性。此对比说明复分析强定理为何需要开集条件。`, 'For f(z)=z³, what is the real value of f′(2)?','f(z)=z³，f′(2)实值多少？',12,'Use the power rule after confirming polynomial holomorphicity.','多项式全纯，可用幂法则。','f′(z)=3z², so f′(2)=12.','f′=3z²，代2得12。');
D('M23.02',`Write f(x+iy)=u(x,y)+iv(x,y). Approaching along real increments gives a candidate derivative u_x+iv_x; approaching along imaginary increments gives v_y−iu_y. Equality forces u_x=v_y and u_y=−v_x, the Cauchy–Riemann equations. These are necessary wherever a complex derivative exists, but satisfying them at a single point alone does not guarantee the full two-dimensional limit.

A sufficient local theorem assumes u and v have continuous first partial derivatives in a neighborhood and satisfy the equations at the point. Real differentiability then supplies a controlled linear approximation, and the equations make its Jacobian the matrix of complex multiplication. If the equations hold throughout an open neighborhood under those regularity assumptions, the function is holomorphic there.

For u=x²−y² and v=2xy, the partials give u_x=v_y=2x and u_y=−v_x=−2y, recovering f(z)=z². Under enough further smoothness, differentiating the equations yields u_xx+u_yy=0 and v_xx+v_yy=0, so real and imaginary parts are harmonic. Reconstructing a harmonic conjugate requires integrating the derivative relations consistently, and global existence can depend on the domain’s topology. Local differential equations do not automatically settle global single-valuedness.`, `写f=u+iv，实增量候选导u_x+iv_x，虚增量为v_y−iu_y，相等迫u_x=v_y、u_y=−v_x。复可微时必要，但仅一点满足不足保证二维极限。

充分局部定理要求u,v邻域一阶偏导连续且该点满足方程，实可微给受控线性近似，方程使雅可比为复乘矩阵。若邻域全满足，则其中全纯。

u=x²−y²、v=2xy给偏导关系，恢复z²。足够光滑再微分得两者拉普拉斯为0，所以实虚部调和。求调和共轭需一致积分导数关系，全局存在还可能依赖域拓扑，局部方程不能自动解决全局单值。`, 'For u=x²−y², what is u_x at (3,2)?','u=x²−y²在(3,2)的u_x是多少？',6,'Differentiate with respect to x while holding y fixed.','固定y对x求偏导。','u_x=2x=6, matching v_y for v=2xy.','u_x=2x=6，与v=2xy的v_y一致。');
D('M23.03',`A contour integral uses a piecewise smooth parameterization z(t): integrate f(z(t))z′(t) over the parameter interval. Reparameterizing while preserving orientation leaves the value unchanged; reversing orientation changes its sign. The derivative factor z′(t) is essential because it records both direction and length scaling along the path.

If f has a primitive F on the domain, the integral along a path from a to b equals F(b)−F(a), so every closed contour has zero integral. Cauchy’s theorem gives this vanishing under appropriate holomorphicity and domain hypotheses. A simply connected open domain has no holes obstructing contraction of loops, and a holomorphic function there has a primitive. Holomorphicity only on the contour is insufficient; singularities in the enclosed region matter.

For f(z)=1/z on a counterclockwise unit circle, set z=e^(it) for 0≤t≤2π. The integrand becomes i, so the integral is 2πi rather than zero. The function is holomorphic away from zero, but the contour surrounds the excluded point. This example demonstrates why one cannot erase domain assumptions from the theorem. When a primitive does exist, path independence is a powerful computational shortcut, but it must first be justified on the relevant region.`, `围道积分对分段光滑z(t)计算∫f(z(t))z′(t)dt，保方向重参数值不变，反向变号，z′包含方向和长度缩放，不能漏。

若域中有原函数F，则路径积分F(b)−F(a)，闭路为0。柯西定理在适当全纯域条件下保证，单连通开域无阻碍回路收缩的洞，其中全纯有原函数。只在围道上全纯不够，内部奇点重要。

1/z逆时针单位圆取z=e^(it)，t从0到2π，被积式为i，积分2πi而非0。零外全纯但围道围排除点，说明域假设不能删。有原函数时路径无关是捷径，但先需证明相关区域有效。`, 'For f(z)=2z with primitive z², what is the integral from 1 to 3 along any path in the plane?','f(z)=2z、原函数z²，从1到3任意平面路径积分实值多少？',8,'Use the endpoint difference of the primitive.','用原函数端点差。','3²−1²=8; the polynomial primitive exists on the entire plane.','9−1=8，多项式原函数全平面存在。');
D('M23.04',`A power series Σa_n(z−z0)^n converges inside a disk with a radius determined by its coefficients and diverges outside that radius; boundary points need separate analysis. For a holomorphic function, the local Taylor coefficients are f^(n)(z0)/n!. Unlike real differentiability alone, complex holomorphicity forces such a convergent local representation and derivatives of every order.

The expansion center and domain matter. The geometric series 1/(1−z)=Σz^n holds only for |z|<1. For |z|>1, rewrite the same function as −(1/z)/(1−1/z), yielding −Σ from n=1 to infinity of z^(−n). These are different expansions of the same formula on different regions. Neither may be substituted at z=1, where the function itself is singular.

Laurent series allow both positive and negative powers and converge on annuli rather than necessarily disks. Their coefficients encode singular behavior at a missing center. A finite negative tail describes a pole; no negative terms describes a removable singularity when the function is defined on a punctured neighborhood; infinitely many negative terms indicate an essential singularity. Termwise differentiation and integration are justified inside the convergence region, with compact-subset control, not by blindly manipulating a formal series at an arbitrary boundary point.`, `幂级数在系数决定收敛半径内收敛、外发散，边界另析。全纯Taylor系数f^(n)(z0)/n!，复全纯强制局部收敛表示与所有阶导，强于仅实可微。

中心和域重要，1/(1−z)=Σz^n仅|z|<1。|z|>1改写−(1/z)/(1−1/z)，得负幂和−Σn≥1 z^(−n)。同公式不同域有不同展开，z=1本身奇异都不能代。

Laurent允许正负幂，在圆环收敛，系数编码缺中心奇异。有限负尾为极点，无负项为可去，无限负项为本性奇点。逐项微积分在收敛域内部由紧子集控制正当化，不是任意边界形式操作。`, 'For |z|<1, what is the coefficient of z⁴ in 1/(1−z)?','|z|<1时1/(1−z)的z⁴系数多少？',1,'Use the geometric series expansion.','使用几何级数。','Every nonnegative-power coefficient in Σz^n equals one.','Σz^n每个非负次系数都为1。');
D('M23.05',`An isolated singularity is a point where a function fails to be holomorphic while remaining holomorphic on a punctured neighborhood. Laurent expansion distinguishes removable singularities, poles, and essential singularities by its negative-power terms. The residue is specifically the coefficient of (z−a)^(−1), not the coefficient of the most negative power and not necessarily a limit of the function itself.

For a simple pole of f at a, the residue is lim as z→a of (z−a)f(z). If f=g/h with holomorphic numerator and denominator, h(a)=0 and h′(a)≠0, the residue is g(a)/h′(a). Higher-order poles require extracting the correct coefficient, often through differentiation or series multiplication; the simple-pole formula cannot be applied unchanged.

The residue theorem says a positively oriented simple closed contour enclosing isolated singularities has integral 2πi times their residue sum, provided the function is holomorphic elsewhere on and inside the contour and no singularity lies on the path. For 1/(z²−1), the residues at 1 and −1 are 1/2 and −1/2. A contour containing both has integral zero even though singularities are present. Thus zero contour integral does not prove there are no enclosed singularities; cancellation can occur.`, `孤立奇点在穿孔邻域全纯而中心不全纯，Laurent负幂区分可去、极点、本性。留数专指(z−a)^−1系数，不是最低幂系数，也不必函数极限。

简单极点留数lim(z−a)f。若f=g/h且h(a)=0、h′(a)≠0，则g(a)/h′(a)。高阶需用微分或级数抽正确系数，不能照套简单式。

正向简单闭围道，无奇点在路径、其他内部全纯时，积分2πi乘内部留数和。1/(z²−1)在1、−1留数为1/2、−1/2，围两点积分0。故积分零不能证明无奇点，可能相消。`, 'What is the residue of 5/(z−3)²+2/(z−3)+7 at z=3?','5/(z−3)²+2/(z−3)+7在3的留数多少？',2,'Select the coefficient of power minus one.','取负一次幂系数。','The residue is two; the leading pole coefficient five belongs to power minus two.','留数2，5属于负二次幂而非留数。');
D('M23.06',`At a point where a holomorphic function has nonzero derivative, its first-order behavior is multiplication by f′(z0). Writing that derivative as re^(iθ) shows a local scale factor r and rotation θ. Both crossing directions receive the same rotation, so their oriented angle is preserved. This is local conformality, not a claim that all global lengths or shapes remain unchanged.

The nonzero-derivative condition matters. For f(z)=z² at zero, the derivative vanishes and angles are doubled rather than preserved in the ordinary local sense. Away from zero, the map is locally conformal but not globally one-to-one on the whole plane, since z and −z share an image. Local invertibility and global bijectivity are different properties.

A Möbius transformation (az+b)/(cz+d) with ad−bc≠0 acts on the extended complex plane and maps generalized circles, meaning circles or lines, to generalized circles. Poles and the point at infinity must be tracked when describing its domain. Such transformations simplify boundary shapes in potential-flow and harmonic-function problems. The transformed boundary conditions and physical interpretation must still be translated correctly; preserving angles does not automatically preserve a field’s magnitude or every material parameter in an application.`, `全纯且导非零处，一阶是乘f′=re^(iθ)，局部尺度r旋转θ，两相交方向同旋转所以有向角保留。这是局部共形，不称所有全局长形不变。

导非零关键，z²在0导0，普通意义角倍增不保角；零外局部共形却全平面非一一，z与−z同像。局部可逆与全局双射不同。

Möbius(az+b)/(cz+d)、ad−bc非零作用扩充平面，广义圆即线或圆映广义圆，需跟踪极点无穷。可简化势流调和边界形，但边界条件物理量仍要正确翻译，保角不自动保持场强或所有材料参数。`, 'Multiplication by 3i scales every nonzero displacement length by what factor?','乘3i使每非零位移长度缩放几倍？',3,'Take the modulus of the complex multiplier.','取复乘数模。','|3i|=3; the argument additionally rotates by π/2.','模3，另旋转π/2。');

D('M24.01',`A topology specifies which subsets are open, abstracting the neighborhood structure used to define continuity. It must contain the empty set and the whole space, be closed under arbitrary unions, and under finite intersections. Infinite intersections are not required to stay open: in the real line, intersecting all intervals (−1/n,1/n) leaves {0}, which is not open in the usual topology.

A basis is a collection of open building blocks satisfying coverage and local intersection-refinement conditions. Every open set is a union of basis elements. Open intervals form a basis for the real line; open balls form a basis for a metric space. A basis need not contain every open set, and the same topology can have many different bases.

For a subset A of a space X, the subspace topology consists of intersections A∩U with U open in X. Thus [0,1/2) is open relative to [0,1], although it is not open as a subset of the whole real line. Always name the ambient space. Closed sets are complements of open sets relative to that space, and a set can be both open and closed, or neither. “Closed” is not simply the everyday opposite of “open” at the level of individual subsets.`, `拓扑指定开集，抽象定义连续的邻域结构，含空全，对任意并和有限交封闭，不要求无限交开。实线(−1/n,1/n)全交为{0}，通常非开。

基是满足覆盖与局部交细化的开积木，所有开集是基元并。实开区间、度量球都成基，同拓扑可有多基，基不必含所有开集。

子空间A拓扑是A∩U，U在X开。[0,1/2)相对[0,1]开，却在全实线非开，需说明环境。闭是相对环境的开补，集合可既开既闭或都不是，单个集合的“闭”不简单是日常“不开”。`, 'A discrete topology on a three-point set contains how many open subsets?','三点集离散拓扑有几个开子集？',8,'Every subset is open in a discrete topology.','离散拓扑全部子集开。','There are 2³=8 subsets.','2³=8个子集。');
D('M24.02',`Continuity is defined through inverse images: f:X→Y is continuous when f⁻¹(V) is open in X for every open V in Y. The inverse-image direction matters because inverse images preserve arbitrary unions and finite intersections without requiring f to be bijective. A continuous map need not send open sets to open sets; image behavior is a separate property.

A homeomorphism is a bijection that is continuous in both directions. It preserves topological structure rather than geometric distances. An interval can be stretched or bent while retaining its topology if no points are glued or torn apart. A continuous bijection alone need not be a homeomorphism when the inverse fails continuity, so both directions must be checked or obtained from a suitable theorem.

For example, a continuous bijection from a compact space to a Hausdorff space is automatically a homeomorphism. Compact subsets have compact images, and compact subsets of a Hausdorff space are closed, so the map is closed and its inverse is continuous. This theorem packages hypotheses that cannot be casually removed. To show two spaces are not homeomorphic, find a preserved property that differs, such as compactness, connectedness, or what happens after removing one point. Visual resemblance alone is insufficient.`, `连续由原像定义：Y每开V的f⁻¹(V)在X开。方向重要，原像无须双射就保持任意并有限交；连续不必把开集像为开，这是另性质。

同胚是双射且双向连续，保拓扑而非距离。可伸弯不粘撕，但仅连续双射未必同胚，逆可能不连续，须查或用定理。

紧致空间到Hausdorff空间连续双射自动同胚：闭子集紧，像紧，Hausdorff紧子集闭，故映射闭、逆连续。假设不可随意删。证不同胚可找紧致、连通或删一点后的性质不同，视觉像不像不足。`, 'Is f(x)=4x−2 from R to R a homeomorphism? Enter 1 for yes and 0 for no.','f(x)=4x−2从R到R是同胚吗？是1否0。',1,'Write its inverse and check both directions.','写逆并查双向。','It is bijective with continuous inverse (y+2)/4; the original map is also continuous.','双射且逆(y+2)/4连续，原函数也连续。');
D('M24.03',`A product space combines coordinate spaces while making coordinate projections continuous. For two factors, products U×V of open sets form a basis. In an infinite product, basic sets restrict only finitely many coordinates and leave the rest unrestricted. Requiring every coordinate to lie in an arbitrary specified open set defines the generally finer box topology, not the usual product topology.

A quotient identifies points according to an equivalence relation. The quotient map q sends each point to its equivalence class, and the quotient topology declares V open precisely when q⁻¹(V) is open. This is the topology making the quotient map continuous with the intended universal property. A picture of glued points is helpful, but the preimage rule supplies the actual neighborhood structure.

Identifying endpoints of [0,1] creates a circle: neighborhoods of the glued point include pieces near both original endpoints. Looking only near zero and forgetting the one-end neighborhood would give the wrong topology. Products and quotients behave differently: a product retains separate coordinate information, while a quotient deliberately forgets distinctions. To define a function on a quotient, first define it upstairs and verify that it is constant on every equivalence class; otherwise its proposed value depends on which representative was chosen.`, `积拓扑使坐标投影连续，两因子开积U×V成基。无限积基只限制有限坐标，其他不限制；所有坐标任意限制得到通常更细箱拓扑，不是常用积。

商按等价关系粘点，q送点到等价类，V开恰q⁻¹(V)开，原像规则给真实邻域而不只是图像。

[0,1]端点识别成圆，粘点邻域须同时包含原两端附近，忘一端会错拓扑。积保独立坐标，商刻意忘区别。定义商上函数，先在原空间定义并查每类常值，否则结果依代表选择而非良定义。`, 'For a function on [0,1] to descend to the quotient identifying 0 and 1, must f(0)=f(1)? Enter 1 yes, 0 no.','函数要下降到识别0与1的商，必须f(0)=f(1)吗？是1否0。',1,'Equivalent representatives must receive the same value.','等价代表须同值。','Otherwise the glued point would have two conflicting proposed outputs.','否则粘点会有两个冲突输出。');
D('M24.04',`Compactness means every open cover has a finite subcover. It is a property of the topology, not a synonym for having finitely many points. In Euclidean space, the Heine–Borel theorem identifies compact sets with closed bounded sets, but this characterization is not valid in every topological or metric space without additional hypotheses.

Connectedness forbids separating the space into two disjoint nonempty relatively open subsets whose union is the whole space. An interval in the real line is connected; a union of two separated intervals is not. Path connectedness supplies a continuous path between every pair of points and implies connectedness, but the converse can fail in general spaces.

Continuous images preserve compactness because an open cover pulls back to an open cover upstairs, where a finite subcover exists. They preserve connectedness because a separation downstairs would pull back to a separation upstairs. Consequently a continuous real-valued function on a nonempty compact space attains its minimum and maximum, and a continuous image of an interval has the intermediate-value property. Attainment is stronger than boundedness: f(x)=x on (0,1) is bounded but has neither a maximum nor a minimum. Check the domain before invoking an extremum theorem.`, `紧致是每开覆盖有有限子覆盖，不等于点有限。欧氏Heine–Borel给闭有界等价，但一般拓扑度量空间无额外假设不能照用。

连通不能拆成两非空不交相对开集覆盖整体。实区间连通，分离两区间并非；道路连通给每两点路径，推出连通，一般反向不成立。

连续像保紧，因为开覆盖拉回可取有限；保连通，因为分离拉回矛盾。因此非空紧空间连续实函数取到最值，区间连续像有介值。取到强于有界，(0,1)上f=x有界却无最大最小。用极值定理前查域。`, 'Does f(x)=x on [2,5] attain a maximum, and what is that maximum?','f(x)=x在[2,5]是否取最大？填最大值。',5,'The closed interval is compact and the function is increasing.','闭区间紧且函数递增。','The maximum five is attained at x=5.','在x=5取最大5。');
D('M24.05',`The Hausdorff property requires distinct points to have disjoint open neighborhoods. In a metric space, if d(x,y)=δ>0, choose balls of radius δ/3 around each. A shared point would force d(x,y)<2δ/3 by the triangle inequality, a contradiction. Thus every metric topology is Hausdorff, although not every Hausdorff topology comes from a metric.

Hausdorff separation ensures that a convergent sequence has at most one limit. If it converged to distinct points with disjoint neighborhoods, sufficiently late terms would need to lie in both neighborhoods simultaneously. This proof depends on the separation property; non-Hausdorff spaces can admit multiple limits for the same sequence.

Separation axioms form a hierarchy and should not be conflated. T1 requires singletons to be closed, while Hausdorff gives disjoint neighborhoods for pairs. In a Hausdorff space, compact subsets are closed: for a point outside a compact set, separate it from each inside point and use a finite subcover to combine the separations. Metric concepts such as completeness require more than topology alone; different metrics inducing the same topology can differ in completeness. Keep statements about distance, Cauchy sequences, and open sets at their appropriate level.`, `Hausdorff要求异点有不交开邻域。度量距δ>0时各取δ/3球，若共点，三角不等式得距<2δ/3矛盾，故度量拓扑均Hausdorff，但反向未必可度量。

Hausdorff使序列极限至多一个，否则晚项必须同时在两不交邻域。非Hausdorff可同序列多极限。

分离公理不同，T1要求单点闭，Hausdorff更给成对不交邻域。Hausdorff中紧子集闭：把外点与各内点分开，紧性取有限覆盖再合并分离。完备等度量性质不只拓扑，同拓扑不同度量可完备性不同，需区分距离、Cauchy和开集层级。`, 'Two metric-space points have distance 9. Using the δ/3 construction, what radius is chosen for each disjoint open ball?','两点距9，用δ/3构造各不交开球半径多少？',3,'Divide the separation by three.','距离除三。','Radius three gives any hypothetical shared point a total distance below six, contradicting nine.','半径3，若共点总距<6，与9矛盾。');
D('M24.06',`A based loop is a continuous map from [0,1] to a space whose two endpoints equal a chosen basepoint. Two loops represent the same fundamental-group element when one deforms continuously into the other while keeping the basepoint fixed throughout. The group operation traverses one loop and then the other, with a rescaling of the time parameter.

The constant loop is the identity, and traversing a loop backward gives its inverse up to homotopy. Associativity holds for homotopy classes even though different parameterizations of three literal concatenated paths need not match point by point. This distinction between paths and equivalence classes is necessary for the group laws.

On a circle, a loop’s winding number records net turns around the circle, and concatenation adds these integers. The fundamental group is therefore isomorphic to the integers. The plane is simply connected and has trivial fundamental group, while the punctured plane retains a winding obstruction around the missing point. Fundamental groups need not be commutative: loops around different holes in a figure-eight can depend on traversal order. A drawing that seems untangled is not by itself a valid homotopy; every intermediate loop must stay in the space and satisfy the required basepoint condition.`, `基点回路是[0,1]到空间连续映射，两端为基点。固定基点连续变形等价给基本群元素，乘法先走一回路再走另一并重参数。

常回路单位，倒走为同伦逆；结合律对同伦类成立，字面三条拼接的不同时间参数未必逐点一样。路径与等价类区分是群律必要。

圆回路绕数为净圈，拼接整数相加，所以基本群同构整数。平面单连通群平凡，去原点平面保绕缺点障碍。群不必交换，8字空间绕不同洞次序可不同。看图解开不够，变形每中间回路须留空间并固定基点。`, 'A circle loop winds three times counterclockwise, then five times clockwise. What is its total winding number?','圆回路先逆时针三圈再顺时针五圈，总绕数多少？',-2,'Assign counterclockwise positive and add signed turns.','逆时针正，相加有符号圈数。','3+(−5)=−2, corresponding to two net clockwise turns.','3−5=−2，净顺时针两圈。');

D('M25.01',`A parametrized curve r(t) is regular where its velocity r′(t) is nonzero. Speed is |r′(t)|, and arc length accumulates its integral. Reparameterization changes how quickly the curve is traced but should not change geometric quantities such as curvature. The unit tangent T=r′/|r′| removes speed from the direction of travel.

Curvature is κ=|dT/ds|, the rate of tangent turning per unit arc length. For a regular plane curve r(t)=(x(t),y(t)), this becomes |x′y″−y′x″|/(x′²+y′²)^(3/2). The denominator corrects for arbitrary tracing speed. A straight line has constant unit tangent and zero curvature, while a circle of radius R has curvature 1/R because its tangent rotates by angle θ over arc length Rθ.

For r(t)=(t,t²), the velocity is (1,2t), acceleration (0,2), and curvature is 2/(1+4t²)^(3/2), giving two at the origin. At a point where velocity vanishes, the regular-curve formula cannot simply be evaluated by cancellation; the curve may have a singular parameterization or a genuine cusp. Distinguish signed planar curvature, which depends on orientation, from nonnegative curvature magnitude.`, `曲线r(t)在r′非零处正则，速率|r′|，弧长积速率。重参数改描速而不应改曲率，单位切T=r′/|r′|除去速率。

κ=|dT/ds|为每弧长切向转动。平面公式|x′y″−y′x″|/(x′²+y′²)^(3/2)，分母补任意速度。直线切向恒定曲率0，半径R圆每弧长Rθ转θ，故1/R。

r=(t,t²)速度(1,2t)、加速度(0,2)，κ=2/(1+4t²)^(3/2)，原点2。速度零时不能直接约公式，可能参数奇异或真尖点。区分依定向的有符号曲率与非负大小。`, 'A circle has radius 5. What is its curvature magnitude?','半径5圆的曲率大小是多少？',0.2,'Curvature is inverse radius.','曲率为半径倒数。','κ=1/5=0.2 in inverse-length units.','κ=1/5=0.2，单位为长度倒数。');
D('M25.02',`A smooth surface patch r(u,v) maps an open region of the parameter plane into three-dimensional space. Regularity requires r_u and r_v to be linearly independent, equivalently their cross product is nonzero. These two derivatives are velocities of coordinate curves and span the tangent plane, which contains all possible instantaneous velocities of curves on the surface through that point.

A normal vector is r_u×r_v, and dividing by its length gives a chosen unit normal. Reversing the parameter order reverses this normal orientation without changing the tangent plane. A parameterization can fail regularity at a coordinate singularity even if the underlying surface is smooth, as longitude-latitude coordinates do at a sphere’s poles. Another chart can resolve that description.

For a graph z=f(x,y), the tangent plane at (a,b,f(a,b)) is z−f(a,b)=f_x(a,b)(x−a)+f_y(a,b)(y−b). This is the first-order linear approximation, not an exact global representation of the surface. For an implicit regular level set F(x,y,z)=0 with nonzero gradient, ∇F is normal because differentiating F along every surface curve gives zero. The nonzero-gradient assumption prevents treating singular intersections as ordinary smooth tangent planes.`, `光滑曲面片r(u,v)从参数平面开域入三维。正则要求r_u、r_v独立，等价叉积非零，两者是坐标曲线速度并张切平面，包含所有过该点曲面曲线瞬时速度。

法向叉积，归一选单位法向，换参数序反向但不改切平面。参数可在坐标奇点失正则而曲面仍光滑，如球极点经纬坐标，换图可解决。

图z=f(x,y)在(a,b)切平面z−f(a,b)=f_x(x−a)+f_y(y−b)，是一阶近似非全局精确。隐式正则F=0梯度非零时∇F法向，因为沿曲面曲线微分F为0；非零条件防把奇异交叉误当普通切平面。`, 'For z=x²+y² at (2,1,5), what is the coefficient of x−2 in the tangent plane?','z=x²+y²在(2,1,5)切平面中x−2系数多少？',4,'Evaluate the x partial derivative at the point.','代入x偏导。','f_x=2x, so the coefficient is four.','f_x=2x，系数4。');
D('M25.03',`The first fundamental form measures lengths and angles within a surface patch. With E=r_u·r_u, F=r_u·r_v, G=r_v·r_v, a parameter displacement (du,dv) has squared first-order length E du²+2F du dv+G dv². Regularity makes this quadratic form positive definite, so it acts as a position-dependent inner product on tangent directions.

Choose a unit normal n. The second fundamental form has coefficients e=r_uu·n, f=r_uv·n, g=r_vv·n. It measures the normal part of how tangent directions change, recording bending relative to the surrounding space. Reversing n changes the second form’s sign but leaves the first form unchanged. Consequently conventions for signed principal curvature must name the normal orientation.

For r(u,v)=(2u,3v,0), the first form is 4du²+9dv² and the second form vanishes. A parameter step (1,1) therefore has geometric length √13, not √2; parameter coordinates are not automatically orthonormal physical coordinates. For a unit tangent direction represented by parameter increments, normal curvature is the ratio of the second form to the first. This relation explains why both forms are required: one measures bending, while the other normalizes by actual tangent length.`, `第一基本形式度量曲面内长角。E=r_u·r_u、F=r_u·r_v、G=r_v·r_v，位移平方一阶长E du²+2F du dv+G dv²。正则使正定，给切向随位置内积。

选单位法n，二形e=r_uu·n、f=r_uv·n、g=r_vv·n度量切方向变化的法向部分，记录外部弯曲。反n使二形变号，一形不变，所以有符号主曲率需指明定向。

r=(2u,3v,0)一形4du²+9dv²，二形0，参数步(1,1)几何长√13而非√2，参数不自动正交单位物理坐标。法曲率为二形除一形，前者度弯曲，后者按实际切长归一。`, 'A surface metric has E=9,F=0,G=4. What is the squared length of parameter displacement (1,2)?','度量E=9,F=0,G=4，参数位移(1,2)平方长多少？',25,'Evaluate E du²+2F du dv+G dv².','代入第一形式。','9×1²+4×2²=9+16=25.','9+16=25。');
D('M25.04',`Normal curvature varies with the tangent direction. Its extreme values are the principal curvatures, eigenvalues of the shape operator under a consistent normal convention. Their product is Gaussian curvature K, and half their sum is mean curvature. Reversing the normal changes both principal signs and mean curvature sign, but preserves their product.

A sphere of radius R has equal principal-curvature magnitudes 1/R and positive Gaussian curvature 1/R². A cylinder has one curved circumferential direction and one straight axial direction, so one principal curvature vanishes and K=0. A saddle can have principal curvatures of opposite sign, producing negative K. These classifications concern local bending rather than the global topology alone.

A geodesic has zero tangential component of acceleration when parametrized by arc length; its acceleration, if nonzero, is normal to the surface. It is locally length-stationary, and sufficiently short geodesic segments minimize length in an appropriate neighborhood, but an arbitrarily long geodesic need not be the globally shortest connection. Great circles are sphere geodesics, yet the long arc between two nonantipodal points is longer than the short arc. A latitude circle other than the equator is generally not a geodesic because following it requires tangential turning on the sphere.`, `法曲率随切方向变，极值为主曲率，是一致法向约定下形算子特征值。积为高斯K，半和为平均曲率。反法向改两主符号和平均符号，不改积。

半径R球主曲率绝对值1/R，K=1/R²；柱周向弯轴向直，一主为0故K0；鞍两主异号K负，是局部弯曲分类不只全局拓扑。

弧长参数测地线加速度切向分量0，非零时全法向。它局部长驻，足够短段在适当邻域最短，但任意长不必全局最短。球大圆测地，非对跖两点长弧仍大于短弧。非赤道纬圈一般非测地，因为需沿球切向转弯。`, 'Principal curvatures are 2 and −3. What is Gaussian curvature?','主曲率2与−3，高斯曲率多少？',-6,'Multiply the principal curvatures.','主曲率相乘。','K=2×(−3)=−6, indicating saddle-type local curvature.','K=−6，局部鞍型。');
D('M25.05',`Intrinsic geometry uses distances, angles, and areas determined by the surface’s own metric, without referring to how the surface sits in surrounding space. A local isometry preserves that metric. Bending a sheet into a cylinder without stretching changes its extrinsic shape while retaining local intrinsic geometry. This distinction separates visible bending from metric curvature.

Gauss’s remarkable theorem states that Gaussian curvature can be determined from the first fundamental form alone. Therefore local isometries preserve it. A plane and cylinder both have zero Gaussian curvature and can be related locally by unrolling. A sphere with positive curvature cannot be flattened into a plane by a local isometry on an open region; some distortion of lengths is unavoidable.

On a sphere of radius R, a geodesic triangle’s angle excess A+B+C−π equals its area divided by R². An octant triangle bounded by three mutually perpendicular great-circle arcs has three right angles, excess π/2, and area πR²/2. This connects curvature to an observable measurement made entirely within the surface. Global identifications still matter: a flat torus can have zero local curvature but a different topology from the plane. Matching local curvature alone does not establish a global isometry or homeomorphism.`, `内在几何只用曲面自身度量的距离角面积，不依嵌入外界。局部等距保度量，无伸缩卷纸成柱改外形却保局部内在，区别可见弯和度量曲率。

高斯绝妙定理说K仅由第一形式决定，故局部等距保K。平面柱皆K0可局部展开，正K球不能在开区域无伸缩平铺，长必有畸变。

球R上测地三角角超A+B+C−π等面积/R²。三互垂大圆弧八分区三角各直角，超π/2，面积πR²/2，把曲率与面内可测量连接。全局识别仍重要，平坦环面局部K0却拓扑异于平面，仅同局部K不证全局等距同胚。`, 'A spherical triangle on a unit sphere has angle excess π/3. Its area is what multiple of π?','单位球测地三角角超π/3，面积是π的几倍？',1/3,'Area equals R² times angle excess.','面积等R²乘角超。','With R=1, area is π/3, so the requested coefficient is 1/3.','R=1，面积π/3，系数1/3。');
D('M25.06',`A manifold is a space locally described by Euclidean coordinates. A chart maps a neighborhood to an open subset of R^n, and overlapping charts are related by transition maps. A smooth structure requires these transitions to be smooth so derivatives computed in one chart can be consistently translated to another. One global coordinate system need not exist, as familiar sphere coordinates already illustrate.

Tangent vectors represent velocities of curves through a point, while a differential one-form acts linearly on tangent vectors to produce a scalar. For a smooth function f, its differential df records first-order change: in coordinates df=Σ(∂f/∂xᵢ)dxᵢ. The coordinate symbols dxᵢ are covectors, not independent infinitesimal numbers to manipulate without transformation rules.

The wedge product combines forms antisymmetrically: dx∧dy=−dy∧dx and dx∧dx=0. The exterior derivative d extends differentiation and satisfies d(df)=0. A generalized Stokes theorem relates the integral of dω over an appropriately oriented smooth region to the integral of ω over its oriented boundary, under the relevant regularity assumptions. This framework unifies familiar fundamental, Green, divergence, and curl theorems. Orientation, dimension, and boundary conventions are essential parts of the statement, not optional notation.`, `流形局部用欧氏坐标，图把邻域映R^n开集，重叠由转移映射关联。光滑结构要求转移光滑，使导数可跨图一致翻译，不必有全局一图，球坐标已说明。

切向量是过点曲线速度，一形式线性作用切向量给标量。df=Σ偏导dxᵢ记一阶变化，dxᵢ是协向量，不是可无变换规则操作的独立无穷小数。

楔积反对称dx∧dy=−dy∧dx，dx∧dx=0。外微分推广求导且d(df)=0。广义Stokes在适当光滑定向正则下把区域∫dω与定向边界∫ω相连，统一微积分基本、Green、散度、旋度定理；定向维数边界约定都是必要部分。`, 'For f=x²+y² at (2,3), apply df to tangent vector (1,−1). What scalar results?','f=x²+y²在(2,3)处，df作用切向量(1,−1)得多少？',-2,'Use df=4dx+6dy at the point.','该点df=4dx+6dy。','4×1+6×(−1)=−2.','4−6=−2。');

D('M26.01',`Floating-point arithmetic represents a finite set of numbers through a sign, significand, and exponent. Many decimal fractions have no exact finite binary representation, so rounding enters even before later operations. Relative error compares an absolute perturbation with the magnitude of the true quantity, and becomes inappropriate or unstable near a true value of zero unless treated carefully.

Conditioning belongs to the mathematical problem: how strongly does its output change when the input is perturbed? Numerical stability belongs to an algorithm: does the computation introduce only small effective perturbations or otherwise control error? A stable method applied to an ill-conditioned problem can still produce a large forward error because the data themselves do not determine the answer robustly.

Subtraction of nearly equal approximate numbers can reveal large relative uncertainty in their small difference. For sqrt(1+x)−1 at tiny x, rationalizing gives x/(sqrt(1+x)+1), avoiding that harmful subtraction while preserving the exact mathematical expression. This reformulation does not improve every possible conditioning issue, but it improves the computation of that expression. Report units, absolute and relative error, and a trustworthy reference. More printed digits do not create information lost through measurement uncertainty or earlier rounding.`, `浮点以符号、有效数和指数表示有限数集，许多十进制小数无有限二进制精确表示，后续运算前已舍入。相对误差用绝对扰动除真值幅度，真零附近需谨慎。

条件性属数学问题，输入扰动如何放大输出；稳定性属算法，计算是否仅引小等效扰动或控误差。稳定法遇病态仍可大前向误差，因为数据本身不能稳确定答案。

相近近似数相减小差的相对不确定可大。小x时sqrt(1+x)−1有理化为x/(sqrt(1+x)+1)避免有害相消，精确式不变。它改计算，不解决所有条件问题。应报单位、绝对相对误差、可靠参考，打印更多位不会恢复测量或先前舍入丢的信息。`, 'An approximation is 10.02 and the exact value is 10. What is the absolute error?','近似10.02、精确10，绝对误差多少？',0.02,'Take the absolute difference, not the relative ratio.','取绝对差而非相对比。','|10.02−10|=0.02; the relative error would be 0.002.','绝对0.02，相对则0.002。');
D('M26.02',`Bisection begins with a continuous function whose endpoint values have opposite signs. The intermediate value theorem guarantees a root inside, and selecting the half that retains a sign change preserves this guarantee. After k halvings, the bracket width is the initial width divided by 2^k. Continuity is essential: a jump can change sign without crossing zero.

Newton’s method replaces the function locally by its tangent line and uses that line’s root: x_next=x−f(x)/f′(x). Near a simple root, with suitable smoothness and a sufficiently close starting point, convergence can be quadratic. A zero or tiny derivative, a poor initial guess, or an unfavorable function shape can instead cause failure, divergence, or cycling. These possibilities do not contradict the local convergence theorem because its assumptions were not met.

For f(x)=x²−9 and x=2, one step gives 2−(4−9)/4=3.25, already beyond the root three; a Newton step need not stay inside an initial interval. Safeguarded methods combine fast local steps with a valid bracket. Stop using criteria tied to the requested accuracy: a small step is not always a small residual, and a small residual does not guarantee small root error when the function is flat.`, `二分要求连续且端值异号，介值保证内部根，保异号半区保持保证。k次区间宽初宽/2^k；连续必要，跳跃可异号不穿零。

Newton以切线根替代：x_new=x−f/f′。简单根附近、足光滑、初猜足近可二次收敛；导数零或小、差初猜、坏形状可失败发散循环，未满足假设不违局部定理。

x²−9从2一步得3.25，越过根3，Newton不一定留初区间。保护方法结合快局部步与有效夹逼。停止需对应目标精度，小步不总小残差，平坦处小残差也不保证根误差小。`, 'A bisection bracket initially has width 8. What is its width after five halvings?','二分初宽8，五次折半后宽多少？',0.25,'Divide by 2^5.','除以2^5。','8/32=0.25.','8/32=0.25。');
D('M26.03',`A linear system Ax=b should usually be solved through a matrix factorization rather than by explicitly computing an inverse. Gaussian elimination produces triangular systems, and substitution then recovers the solution. Partial pivoting chooses a sufficiently large available pivot in the current column to reduce dangerous division by tiny values and control many common rounding problems.

The residual r=Axhat−b measures how well an approximate solution satisfies the equations. A small residual is evidence of a small backward perturbation under suitable scaling, but not necessarily a small forward error xhat−x. Ill-conditioned matrices can map a large solution error to a tiny residual. A condition number quantifies that amplification relative to the chosen norm.

For A=diag(1,10^(−6)) and b=(1,10^(−6)), the exact solution is (1,1). Approximation (1,0) has a residual of magnitude only 10^(−6) in the second coordinate but solution error one there. This illustrates why residuals must be interpreted with conditioning. For least squares, QR factorization avoids explicitly forming normal equations, which square the two-norm condition number for full-column-rank problems. Singular value decomposition reveals near-rank deficiency and supports regularization. Precision, scaling, algorithm choice, and data uncertainty all contribute to the final numerical interpretation.`, `Ax=b通常用分解而非显式逆。高斯消元成三角再回代，部分选主元选当前列较大可用元，减少小量除法危险并控制常见舍入。

残差r=Axhat−b看满足方程程度，适当缩放下小残差支持小后向扰动，却不一定小解前向误差。病态矩阵可把大解错映为小残差，条件数按范数量化放大。

A=diag(1,10^−6)、b=(1,10^−6)真解(1,1)，近似(1,0)第二残差仅10^−6却解错1。最小二乘QR避免正规方程在满列秩下平方二范数条件数。SVD揭近秩缺并支持正则。精度缩放算法与数据不确定共同影响解释。`, 'For A=diag(3,4) and b=(12,20), what is the second coordinate of the exact solution?','A=diag(3,4)、b=(12,20)，精确解第二坐标多少？',5,'Solve the second diagonal equation.','解第二对角方程。','4x₂=20, so x₂=5.','4x₂=20，x₂=5。');
D('M26.04',`Interpolation constructs a function matching given sample values exactly. A polynomial through n+1 distinct nodes has degree at most n and is unique, but higher degree does not guarantee a better approximation between the nodes. Equally spaced high-degree interpolation can oscillate near interval ends. Piecewise low-degree interpolation or carefully chosen nodes can behave more reliably.

Quadrature estimates an integral from sampled values and weights. The trapezoid rule integrates the straight line joining endpoint values. For a convex function, that chord lies above the graph, so the one-panel trapezoid overestimates the integral; for a concave function it underestimates. Composite rules apply the same idea on smaller subintervals. With sufficient smoothness and bounded derivatives, error estimates quantify improvement as the step shrinks.

For f(x)=x² on [0,2], one trapezoid gives width two times average endpoint height two, or four, while the exact integral is 8/3. Splitting at one gives trapezoid areas 1/2 and 5/2, total three. The estimate improves but is not exact. Simpson’s rule integrates a fitted quadratic and is exact for cubic polynomials under its usual equally spaced panel setup. Singularities or discontinuities require adapted treatment; a smooth-function error formula cannot be applied across an unexamined singular point.`, `插值精确匹配样本，n+1异节点唯一次数≤n多项式，但高次数不保证节点间更好，等距高次端部可振荡；分段低次或精心节点可更稳。

求积用样本权估积分，梯形积端点弦。凸函数弦在上故高估，凹则低估；复合在小区间用，同足光滑和导数界下可估缩步误差。

x²在[0,2]单梯形4，真8/3；在1分两段面积1/2、5/2，总3，改善非精确。Simpson拟二次却在通常等距面板对三次也精确。奇点不连续需适配，不能跨未查奇点套光滑误差公式。`, 'Using one trapezoid, approximate the integral of f(x)=x² on [0,3].','单梯形近似x²在[0,3]积分，值多少？',13.5,'Multiply width by the average of endpoint heights.','宽乘端点高度平均。','3×(0+9)/2=13.5, above the exact value nine because x² is convex.','3×9/2=13.5，凸故高于真值9。');
D('M26.05',`A convex feasible set contains every segment between its points. A differentiable convex objective satisfies f(y)≥f(x)+∇f(x)·(y−x), meaning every tangent plane lies below its graph. If an unconstrained interior point has zero gradient, this inequality immediately proves global optimality. For a nonconvex function, zero gradient can instead indicate a maximum or saddle.

Gradient descent chooses x_next=x−η∇f(x), moving against the local direction of fastest increase in the Euclidean metric. Step size controls whether the local approximation remains useful. For a smooth convex objective with L-Lipschitz gradient, appropriate bounded step choices yield descent guarantees; choosing η arbitrarily large removes those guarantees. Poor scaling can make level sets elongated and progress slow.

For f(x)=(x−4)², starting at zero with η=1/4 gives x_next=2. The objective drops from sixteen to four. Starting with η=2 gives x_next=16 and objective 144, illustrating overshoot despite convexity. Strong convexity supplies additional uniqueness and convergence properties, while merely convex objectives may have whole sets of minimizers. Check gradient calculations with independent finite-difference comparisons at suitable step sizes, but remember that such checks are numerical evidence rather than a symbolic proof.`, `凸可行集含两点线段。可微凸目标满足f(y)≥f(x)+∇f(x)·(y−x)，切平面在图下。无约束内点梯度0直接全局最优；非凸0梯度也可极大或鞍。

梯降x_new=x−η∇f，欧氏度量下逆局部最快上升。步长决定局部近似适用，L-Lipschitz梯度等光滑条件配合适步有下降保证，任意大η无保证。差缩放使等高线狭长而慢。

(x−4)²从0、η1/4到2，目标16降4；η2到16、目标144，凸也可越过。强凸增唯一和收敛性质，一般凸可多最优。可用合适步有限差分独立查梯度，但数值证据非符号证明。`, 'For f(x)=(x−4)², starting at x=1 with step η=1/4, what is the next gradient-descent iterate?','f=(x−4)²，从x=1、步1/4，梯降下一值多少？',2.5,'The gradient at one is 2(1−4)=−6.','梯度2(1−4)=−6。','x_next=1−(1/4)(−6)=2.5.','1+1.5=2.5。');
D('M26.06',`Constrained optimization requires feasibility before optimality: a low objective value at an illegal point is not a candidate solution. For inequalities g_i(x)≤0, form the Lagrangian L=f+Σλ_i g_i with λ_i≥0, together with unrestricted multipliers for equality constraints. The sign convention must match the direction of the inequalities.

KKT conditions combine stationarity of the Lagrangian, primal feasibility, dual nonnegativity, and complementary slackness λ_i g_i=0. Complementary slackness means an inactive strict inequality has zero multiplier, while an active constraint may carry a nonzero multiplier. Necessity requires suitable constraint qualifications; convex problems with appropriate assumptions make feasible KKT points globally optimal. The conditions are not an unconditional recipe for every nonconvex problem.

For minimizing (x−3)² subject to x−1≤0, the unconstrained optimum three is infeasible. At x=1, stationarity gives 2(1−3)+λ=0, so λ=4≥0 and complementary slackness holds. The boundary optimum has objective four. A numerical solver’s success flag should be checked against constraint residuals, stationarity, and objective comparisons or bounds. Near-feasible values can violate a strict application requirement, so specify tolerances and verify the returned solution in the original units and constraints.`, `约束优化先可行后最优，非法点目标再低也非候选。g_i≤0时L=f+Σλ_i g_i且λ_i≥0，等式乘子不限，符号须匹配不等式方向。

KKT含拉格朗日驻点、原可行、对偶非负、互补λ_i g_i=0。严格未激活约束乘子0，激活可非零。必要需适当约束规范，凸与适当假设使可行KKT全局最优，非所有非凸无条件配方。

min(x−3)²且x−1≤0，无约束3非法。x=1驻点2(1−3)+λ=0得λ4非负，互补成立，目标4。数值成功标记还要查约束残差、驻点、目标比较或界。近可行可能违反应用严格要求，应指定容差并原单位约束复核。`, 'Minimize (x−5)² subject to x≤2. What is the minimum objective value?','最小化(x−5)²且x≤2，最小目标值多少？',9,'The nearest feasible point to five is the boundary two.','离5最近可行点是边界2。','At x=2, the objective is (2−5)²=9; moving farther left increases it.','x=2时9，继续左移更大。');
