// Original explanatory expansions and new assessment versions for linear algebra.
const B=(en,zh)=>({en,zh});
const details=new Map();
const numeric=(id,en,zh,answer,hint,hintZh,explanation,explanationZh)=>({id,type:'numeric',prompt:B(en,zh),answer,hints:[B(hint,hintZh)],explanation:B(explanation,explanationZh)});
const choice=(id,en,zh,options,answer,hint,hintZh,explanation,explanationZh)=>({id,type:'choice',prompt:B(en,zh),options:options.map(([key,en,zh])=>({id:key,text:B(en,zh)})),answer,hints:[B(hint,hintZh)],explanation:B(explanation,explanationZh)});
function D(id,en,zh,checks){details.set('module.'+id,{body:B(en,zh),checks});}

D('M09.01',`A linear equation adds constant multiples of unknowns; it does not multiply unknowns together. A system asks for values satisfying every equation simultaneously. Its augmented matrix stores coefficients to the left of a dividing line and the constants to the right. A row operation changes a whole equation, including its constant. Each allowed operation has an inverse, so it preserves exactly the solutions rather than merely producing some new equation that every old solution satisfies.

Elimination chooses a nonzero pivot and subtracts multiples of its row to clear entries below it. Swap rows if the intended pivot is zero. A staircase of pivots gives echelon form; clearing above pivots as well gives reduced echelon form. A row with all zero coefficients but a nonzero constant says that zero equals a nonzero number, so the system is inconsistent. A zero row with zero constant imposes no new restriction.

For a consistent system, columns without pivots correspond to free variables. Choose their values and solve for the pivot variables. Thus two equations need not determine two unknowns: one may repeat the other. For example x+2y=4 and 2x+4y=8 describe the same line. Taking y=t gives x=4−2t and infinitely many solutions. Substitution into the original equations is a final check, especially after fractions or signs appear.`, `线性方程把未知量乘以常数后相加，不把未知量彼此相乘。方程组要求所有方程同时成立。增广矩阵在分隔线左边写系数，右边写常数。行变换作用于整行，常数项也必须一起改变。交换两行、用非零数乘一行、把另一行的倍数加到本行，都有逆操作，因此精确保留解集。

消元时选择非零主元，再减去主元行的适当倍数，清除其下方元素。预定主元为零时先换行。主元逐行向右移动就得到阶梯形；再清除主元上方元素可得到简化阶梯形。若一行系数全为零而常数不为零，就出现“零等于非零数”的矛盾，因此无解。系数和常数全为零的一行则不增加约束。

相容方程组中，没有主元的列对应自由变量。先任取自由变量，再求主元变量。因此两个方程未必能确定两个未知量，一个方程可能只是另一个的重复。例如 x+2y=4 与 2x+4y=8 表示同一直线，令 y=t 就得到 x=4−2t，有无穷多解。最后代回原方程检查，特别注意分数和符号。`, id=>[
 numeric(id+'.v2.1','Solve x+2y=8 and 3x−2y=4. What is x?','解 x+2y=8，3x−2y=4。x 是多少？',3,'Add the equations to eliminate y.','两式相加消去 y。','Addition gives 4x=12, so x=3; substitution gives y=2.5.','相加得 4x=12，所以 x=3；代回得 y=2.5。'),
 choice(id+'.v2.2','What happens for x+2y=4 and 2x+4y=9?','x+2y=4 与 2x+4y=9 的解如何？',[['none','No solution','无解'],['one','Exactly one solution','恰有一解'],['many','Infinitely many solutions','无穷多解']],'none','Subtract twice the first equation from the second.','从第二式减去第一式的两倍。','The resulting equation is 0=1, a contradiction.','消元得到 0=1，出现矛盾，因此无解。')]);

D('M09.02',`A vector is an object that can be added to another vector and multiplied by a scalar. In a coordinate space, these operations act component by component. A linear combination chooses one scalar for each listed vector, scales them, and adds the results. The span contains every result obtainable by making all possible choices of those scalars. Coefficients may be negative or zero; a span is usually much larger than the finite list used to generate it.

To ask whether b lies in the span of v₁ and v₂, write av₁+b₂v₂=b and solve for the coefficients a and b₂. The same equation with right side zero tests independence. If a nonzero coefficient choice produces the zero vector, one listed vector can be expressed using the others, and the list is dependent. Independence means the only zero-producing choice has every coefficient zero. A list containing the zero vector is therefore dependent.

There is a useful connection between these tests. Independent vectors give at most one representation of any target: subtract two proposed representations and independence forces their coefficients to agree. Spanning gives at least one representation for every target in the chosen space. Together they give exactly one representation. In the plane, (1,1) and (1,−1) are independent: adding and subtracting a+b=0, a−b=0 forces a=b=0. Three vectors in the plane must be dependent, even when no pair is parallel.`, `向量是可以相加、可以乘以标量的对象。在坐标空间中，这些运算逐分量进行。线性组合为每个向量选择一个标量，相乘后再求和。张成集合包含所有可能系数组合产生的结果；系数允许为负或为零，因此有限个向量通常能张成无限集合。

判断目标向量是否在 v₁、v₂ 的张成集合中，就把目标写成 av₁+bv₂ 并求系数。将目标换成零向量，则是在检查线性无关性。如果存在不全为零的系数使组合等于零，其中一个向量就可用其余向量表示，向量组线性相关。线性无关要求产生零向量的系数只能全部为零。因此包含零向量的向量组必定相关。

两个判定紧密相连：无关性保证同一个目标至多有一种表示，因为两种表示相减后得到零组合；张成性保证空间内每个目标至少有一种表示。两者同时成立就保证表示唯一。例如平面内 (1,1)、(1,−1) 无关：由 a+b=0、a−b=0 得 a=b=0。但平面内任何三个向量都相关，即使任意两个都不平行。`, id=>[
 numeric(id+'.v2.1','Write (5,1)=a(1,1)+b(1,−1). Find a.','将 (5,1)=a(1,1)+b(1,−1)，求 a。',3,'The coordinates give a+b=5 and a−b=1.','坐标分别给出 a+b=5、a−b=1。','Adding gives 2a=6, so a=3 and b=2.','相加得 2a=6，因此 a=3、b=2。'),
 choice(id+'.v2.2','Which list is linearly independent in the real plane?','实平面中哪组向量线性无关？',[['a','(1,2), (2,4)','(1,2)、(2,4)'],['b','(1,2), (0,1)','(1,2)、(0,1)'],['c','(0,0), (1,0)','(0,0)、(1,0)']],'b','Set a times the first vector plus b times the second equal to zero.','令两个向量的线性组合等于零，检查系数。','For option b, the first coordinate forces a=0; the second then forces b=0. The other lists contain a multiple or the zero vector.','选项 b 的第一坐标迫使 a=0，第二坐标再迫使 b=0。另两组分别含倍数关系或零向量。')]);

D('M09.03',`A vector space specifies both its objects and its allowed scalars. Real polynomials of degree at most two form a real vector space: adding them or multiplying by a real number stays inside the set. Polynomials of degree exactly two do not form a space, because subtraction may remove the quadratic term and the zero polynomial is absent. Matrix entries, coordinate vectors and functions can all be vectors; arrows in a picture are only one example.

A subspace is a subset of a vector space using the same operations. Check that zero belongs and that au+bv remains in the subset for every pair u,v and all allowed scalars a,b. A line through the origin passes this test. A translated line generally fails it. Homogeneous linear constraints define subspaces because applying a linear constraint to au+bv combines two zeros.

A basis must do two jobs: span the entire space and contain no redundancy. Once a basis is fixed and ordered, every vector has a unique coordinate list. The list depends on the basis; the underlying vector does not. Dimension is the number of vectors in any basis, a number that is independent of which basis is chosen. In finite dimensions, an independent list can be extended to a basis, and a spanning list can be reduced to one. The zero space has dimension zero and its basis is the empty list.`, `向量空间必须同时说明对象和标量范围。次数不超过二的实系数多项式构成实向量空间，因为相加或乘以实数后仍在其中。“次数恰为二”的多项式却不构成向量空间：相减可能消掉二次项，而且其中没有零多项式。矩阵、坐标组和函数都可以是向量，图中的箭头只是一个例子。

子空间沿用原空间的运算。应检查零向量在其中，且任意 u、v 以及允许的标量 a、b 都满足 au+bv 仍在其中。过原点的直线满足条件，平移后的直线通常不满足。齐次线性约束定义子空间，因为把约束作用于 au+bv，就是把两个零作线性组合。

基同时要求张成整个空间和没有冗余。固定一个有顺序的基后，每个向量有唯一坐标组。换基会改变坐标，但不会改变向量本身。维数是任意一个基所含向量的数目，与具体选基无关。在有限维空间中，无关组可扩充成基，生成组可删减成基。零空间只有零向量，维数为零，其基为空组。`, id=>[
 numeric(id+'.v2.1','What is the dimension of the real polynomials of degree at most 4?','次数不超过 4 的实多项式空间维数是多少？',5,'Include the constant polynomial as well as positive powers.','除了正次幂，也要包括常数多项式。','A basis is 1,x,x²,x³,x⁴, containing five elements.','基可取 1、x、x²、x³、x⁴，共五个元素。'),
 choice(id+'.v2.2','Which subset of the real plane is a subspace?','实平面的哪一个子集是子空间？',[['a','x+y=1','x+y=1'],['b','x+y=0','x+y=0'],['c','x≥0','x≥0']],'b','Check zero and closure under multiplication by −1.','检查零向量，以及乘以 −1 后是否仍在集合内。','x+y=0 is a homogeneous linear constraint. The first set excludes zero; the third fails closure under negative scaling.','x+y=0 是齐次线性约束。第一组不含零向量；第三组不对负数倍封闭。')]);

D('M09.04',`A linear map preserves addition and scalar multiplication, so applying it to a combination can be done before or after combining. In particular it sends zero to zero, although that condition alone is not sufficient for linearity. For example squaring a real number sends zero to zero but fails to preserve sums. Always test the two operations or their combined identity, not merely one convenient input.

Fix an ordered basis e₁,…,eₙ for the input space and one for the output. Put the coordinates of T(eⱼ) in column j of a matrix A. Since x=x₁e₁+⋯+xₙeₙ, linearity gives T(x)=x₁T(e₁)+⋯+xₙT(eₙ). This explains matrix-vector multiplication: Ax is a weighted sum of columns. A map from n coordinates to m coordinates has an m-by-n matrix. The transpose Aᵀ exchanges its rows and columns; it is not generally an inverse.

If B acts first and A acts second, their composition has matrix AB because x goes to Bx and then A(Bx). Order matters and the inner dimensions must agree. A two-dimensional shear with columns (1,0),(2,1) maps (3,4) to (11,4); it tilts the vertical direction without changing horizontal vectors. The kernel contains inputs mapped to zero, while the image contains all possible outputs. Both are subspaces, and rank plus kernel dimension equals input dimension.`, `线性映射保持加法和数乘，因此“先组合再映射”和“先映射再组合”结果相同。线性映射一定把零映到零，但仅此还不够；例如平方运算把零映到零，却不保持加法。应检验两个运算，或检验合并后的线性恒等式。

固定输入和输出空间的有序基，把 T(eⱼ) 的输出坐标作为矩阵 A 的第 j 列。由 x=x₁e₁+⋯+xₙeₙ，线性性给出 T(x)=x₁T(e₁)+⋯+xₙT(eₙ)。所以矩阵乘向量，本质上是按输入坐标给各列加权求和。从 n 维坐标到 m 维坐标的矩阵有 m 行 n 列。转置 Aᵀ 交换行与列，通常不是逆矩阵。

若先做 B 再做 A，复合的矩阵是 AB，因为 x 先变成 Bx，再变成 A(Bx)。顺序重要，矩阵内侧维数必须相等。列为 (1,0)、(2,1) 的剪切矩阵把 (3,4) 变为 (11,4)，使竖直方向倾斜，却保持水平方向向量。核是被映到零的输入集合，像是全部可能输出；两者都是子空间。秩与核的维数之和等于输入空间维数。`, id=>[
 numeric(id+'.v2.1','A has columns (1,0) and (3,1). What is the first coordinate of A(2,5)?','A 的两列为 (1,0)、(3,1)。A(2,5) 的第一坐标是多少？',17,'Form 2 times the first column plus 5 times the second.','计算第一列的 2 倍加第二列的 5 倍。','A(2,5)=(2,0)+(15,5)=(17,5).','A(2,5)=(2,0)+(15,5)=(17,5)。'),
 choice(id+'.v2.2','Which map from the real plane to itself is linear?','哪个实平面到自身的映射是线性的？',[['a','T(x,y)=(x+1,y)','T(x,y)=(x+1,y)'],['b','T(x,y)=(2x−y,x)','T(x,y)=(2x−y,x)'],['c','T(x,y)=(x²,y)','T(x,y)=(x²,y)']],'b','Each output coordinate must be a linear combination without a constant shift.','输出坐标应为没有常数平移的线性组合。','Option b has matrix rows (2,−1),(1,0). Option a moves zero; option c fails additivity.','b 的矩阵两行为 (2,−1)、(1,0)。a 将零移走；c 不保持加法。')]);

D('M09.05',`The determinant assigns one scalar to a square matrix. Geometrically it gives the signed volume scale of the associated map: magnitude describes stretching of volume, and sign records orientation. A zero determinant means that full-dimensional volume is flattened into a lower-dimensional set. It does not mean that every vector is sent to zero, or that every matrix entry vanishes.

For two columns (a,c) and (b,d), the signed parallelogram area is ad−bc. In larger dimensions, expansion by cofactors or elimination computes the determinant. Swapping rows reverses its sign; multiplying a row by k multiplies it by k; adding a multiple of another row leaves it unchanged. The determinant of a triangular matrix is the product of its diagonal entries, so elimination is efficient if you track these changes. Determinants multiply under composition: det(AB)=det(A)det(B).

An inverse undoes a map on every vector. For a square matrix, having an inverse is equivalent to nonzero determinant, independent columns, a pivot in every column, and a unique solution of Ax=b for each b. To find an inverse systematically, row-reduce the augmented matrix [A | I] into [I | A⁻¹]. If the left block cannot become I, no inverse exists. In calculations, solve a system directly rather than explicitly forming an inverse when that is more stable or efficient.`, `行列式给每个方阵对应一个标量。从几何上看，它是映射对有向体积的缩放倍数：绝对值表示体积伸缩，符号表示方向是否翻转。行列式为零，说明满维体积被压扁到较低维集合，不表示每个向量都变成零，也不表示所有矩阵元素都是零。

两列为 (a,c)、(b,d) 时，有向平行四边形面积为 ad−bc。更高维可用余子式展开或消元。交换两行使行列式变号；一行乘 k 使行列式乘 k；把另一行的倍数加到本行不改变行列式。三角矩阵的行列式等于对角元素乘积，因此记录行变换影响后，消元能高效求行列式。复合映射满足 det(AB)=det(A)det(B)。

逆矩阵必须对每个向量撤销原映射。对方阵而言，可逆、行列式非零、列无关、每列都有主元，以及 Ax=b 对每个 b 都唯一可解，是等价条件。系统求逆可对增广矩阵 [A | I] 行化简得到 [I | A⁻¹]；若左半部分无法变成 I，就不存在逆矩阵。实际计算若只需解方程组，直接求解往往比先算出逆矩阵更高效或稳定。`, id=>[
 numeric(id+'.v2.1','A has rows (3,2),(4,3). Find det(A).','A 的两行为 (3,2)、(4,3)。求 det(A)。',1,'Use ad−bc and keep the row order.','使用 ad−bc，保持行的顺序。','3×3−2×4=9−8=1, so A is invertible.','3×3−2×4=9−8=1，因此 A 可逆。'),
 numeric(id+'.v2.2','A 3×3 matrix has determinant 5. Swap two rows, then multiply one row by 3. What is the new determinant?','一个 3×3 矩阵行列式为 5。交换两行，再将一行乘以 3，新行列式是多少？',-15,'Track the sign change and the scale factor separately.','分别记录变号和倍数变化。','The swap gives −5; scaling one row by 3 gives −15.','换行后为 −5，一行乘 3 后为 −15。')]);

D('M09.06',`An eigenvector is a nonzero direction whose image stays on its own line. The eigenvalue is the scale factor, which may be negative or zero. The zero vector is excluded because Av=λv would otherwise hold for every λ and reveal no direction. To find eigenvalues, solve det(A−λI)=0. For each candidate, solve (A−λI)v=0 and retain the nonzero solutions; these form its eigenspace together with zero.

If an n-by-n matrix has n independent eigenvectors, collect them as the columns of P. The equation AP=PD then says that the matrix acts by separate scalings in this basis, giving A=PDP⁻¹. Powers simplify to Aᵏ=PDᵏP⁻¹ because neighboring P⁻¹P factors cancel. Distinct eigenvalues have independent eigenvectors, so n distinct eigenvalues guarantee diagonalizability over the field containing them. Repeated eigenvalues require checking eigenspace dimensions rather than merely counting roots.

For the matrix with rows (3,1),(0,3), solving (A−3I)v=0 forces the second coordinate to zero. Its only eigenvalue is 3 but its eigenspace has dimension one, so it cannot be diagonalized as a two-dimensional map. Over the real numbers, a quarter-turn has no eigenvectors at all; allowing complex coordinates changes the answer. Specify the scalar field before concluding whether diagonalization is possible.`, `特征向量是映射后仍留在自身直线上的非零向量，特征值是相应伸缩倍数，可以为负或为零。必须排除零向量，否则 Av=λv 对任意 λ 都成立，无法表达方向信息。先解 det(A−λI)=0 求特征值，再对每个候选解 (A−λI)v=0。非零解是对应特征向量，加上零向量一起构成特征子空间。

若 n 阶矩阵有 n 个无关特征向量，以它们为 P 的列，就有 AP=PD，说明在这个基下映射只是各坐标分别伸缩，即 A=PDP⁻¹。相邻的 P⁻¹P 抵消，所以 Aᵏ=PDᵏP⁻¹，求幂变得简单。不同特征值的特征向量无关，因此在相应数域上有 n 个不同特征值就保证可对角化。遇到重根，必须检查特征子空间维数，不能只数根的重数。

例如两行为 (3,1)、(0,3) 的矩阵，方程 (A−3I)v=0 迫使第二坐标为零。唯一特征值虽是 3，特征子空间却只有一维，不足以给二维空间提供特征向量基，因此不可对角化。实数范围内，旋转九十度没有特征向量；允许复坐标则结论改变。判断可否对角化之前要先说明标量数域。`, id=>[
 numeric(id+'.v2.1','A is diagonal with entries −2 and 4. What is the first diagonal entry of A³?','A 是对角元为 −2、4 的对角矩阵。A³ 的第一个对角元是多少？',-8,'Powers of a diagonal matrix act on each diagonal entry.','对角矩阵求幂，就是分别对对角元求幂。','(−2)³=−8; the negative sign is retained for an odd power.','(−2)³=−8，奇次幂保留负号。'),
 choice(id+'.v2.2','A real 2×2 matrix has just eigenvalue 7, with a one-dimensional eigenspace. Is it diagonalizable over the real numbers?','实 2×2 矩阵仅有特征值 7，特征子空间一维。它能在实数域对角化吗？',[['yes','Yes, because its eigenvalue is real','能，因为特征值是实数'],['no','No, two independent eigenvectors are required','不能，需要两个无关特征向量']],'no','Count available independent eigenvectors, not repeated roots.','数可用的无关特征向量，不是特征根的重复次数。','One independent eigenvector cannot form a basis of a two-dimensional space.','一个无关特征向量不足以构成二维空间的基。')]);

D('M10.01',`On a real vector space, an inner product is a rule assigning a real number to a pair of vectors. It is linear in each input, symmetric when the inputs are exchanged, and positive on a vector paired with itself unless that vector is zero. The familiar dot product adds coordinatewise products, but other inner products can assign different weights to different coordinates. The chosen inner product determines which vectors count as perpendicular.

The length of v is the square root of its inner product with itself. Two vectors are orthogonal when their inner product is zero. Nonzero orthogonal vectors are independent: take the inner product of a proposed zero combination with each vector to isolate its coefficient. Dividing each orthogonal vector by its own length produces an orthonormal list, whose elements are perpendicular and have length one.

To remove the component of v along a nonzero vector u, subtract u multiplied by (u·v)/(u·u). The remainder is orthogonal to u because its dot product with u is zero. Gram–Schmidt repeats this subtraction for every earlier orthonormal direction, then normalizes the remainder. A zero remainder signals dependence; it cannot be normalized. Starting from (1,1) and (1,0), subtract half of (1,1) from the second to obtain (1/2,−1/2). Normalize the resulting perpendicular directions only after the projections have been removed.`, `实向量空间上的内积，为每一对向量指定一个实数。它对两个输入分别满足线性性，交换输入时数值相同，并且非零向量与自身的内积为正。通常的点积把对应坐标乘积相加，但也可选择对不同坐标赋予不同权重的内积。因此“垂直”取决于选定的内积。

向量 v 的长度是它与自身内积的平方根。两向量内积为零就称正交。非零正交向量一定无关：将零线性组合与每个向量分别作内积，即可逐个求出系数为零。把每个正交向量除以自身长度，便得到两两垂直、长度均为一的标准正交组。

要去掉 v 沿非零向量 u 的分量，就减去 u 的 (u·v)/(u·u) 倍。余量与 u 的点积为零，所以与 u 正交。Gram–Schmidt 方法依次减去沿所有已得到标准正交方向的分量，再归一化余量。余量为零表示相关，不能对它归一化。例如从 (1,1)、(1,0) 出发，第二个向量减去第一个的一半，得 (1/2,−1/2)。先移除投影，再对两个垂直方向分别归一化。`, id=>[
 numeric(id+'.v2.1','Find the dot product of (2,−1,3) and (1,4,0).','求 (2,−1,3) 与 (1,4,0) 的点积。',-2,'Multiply corresponding coordinates, then add.','对应坐标相乘后求和。','2×1+(−1)×4+3×0=−2.','2×1+(−1)×4+3×0=−2。'),
 numeric(id+'.v2.2','For u=(1,2), the projection of v=(4,3) onto span{u} is cu. Find c.','u=(1,2)，v=(4,3) 在 span{u} 上的投影为 cu，求 c。',2,'Divide u·v by u·u; u is not a unit vector.','用 u·v 除以 u·u；u 不是单位向量。','u·v=10 and u·u=5, so c=2. The remainder (2,−1) is orthogonal to u.','u·v=10，u·u=5，故 c=2。余量 (2,−1) 与 u 正交。')]);

D('M10.02',`An inconsistent system Ax=b has no exact solution, but it may have a useful approximate solution. Least squares chooses x to minimize the squared Euclidean length of the error Ax−b. Because Ax always lies in the column space of A, this asks for the point in that subspace nearest b. It is a geometric projection problem, not a rule saying that the original equations suddenly become consistent.

At the minimum, the residual r=b−Ax must be perpendicular to every column. Otherwise moving a little in a column direction would reduce the distance. Collecting those perpendicularity conditions gives Aᵀr=0, hence the normal equations AᵀAx=Aᵀb. If A has independent columns, AᵀA is positive definite and the minimizing coefficient vector is unique. With dependent columns, the projected point is still unique but several coefficient vectors may describe it.

Fitting a constant c to observations 2,4,9 uses a column of three ones. The normal equation is 3c=15, so c=5. The residuals −3,−1,4 sum to zero, expressing orthogonality to the constant column. A line fit instead uses columns of ones and input coordinates. Compare residual patterns afterward: a curved pattern can show that the chosen linear model misses structure. In numerical software, QR or SVD is often preferable to forming AᵀA because normal equations can amplify conditioning problems.`, `当 Ax=b 不相容时，没有精确解，但仍可能有有用的近似解。最小二乘选择 x，使误差 Ax−b 的欧氏长度平方最小。由于 Ax 一定位于 A 的列空间中，这实际上是在子空间内寻找距 b 最近的点，即正交投影，并没有使原来的矛盾方程变得相容。

最优点处，残差 r=b−Ax 必须垂直于每一列；否则沿某列方向稍微移动，就能进一步减小距离。把这些条件写在一起得到 Aᵀr=0，也就是正规方程 AᵀAx=Aᵀb。若 A 的列无关，则 AᵀA 正定，最优系数向量唯一。列相关时，投影点仍唯一，但可能有多个系数向量表示同一点。

用常数 c 拟合数据 2、4、9，对应由三个 1 组成的一列。正规方程为 3c=15，所以 c=5。残差 −3、−1、4 之和为零，正体现残差与常数列正交。拟合直线时再加入由输入坐标组成的一列。拟合后还要检查残差图样：弯曲趋势可能说明线性模型遗漏结构。数值计算通常优先采用 QR 或 SVD，因为直接形成 AᵀA 可能放大病态性。`, id=>[
 numeric(id+'.v2.1','Which constant minimizes (c−1)²+(c−5)²+(c−12)²?','哪个常数使 (c−1)²+(c−5)²+(c−12)² 最小？',6,'The normal equation makes the three residuals sum to zero.','正规方程要求三个残差之和为零。','3c=1+5+12=18, so c=6.','3c=1+5+12=18，因此 c=6。'),
 choice(id+'.v2.2','If A has dependent columns, which statement about least squares is guaranteed?','若 A 的列相关，关于最小二乘哪个结论一定成立？',[['a','The nearest point Ax in the column space is unique','列空间内最近的点 Ax 唯一'],['b','The coefficient vector x is unique','系数向量 x 唯一'],['c','The residual is always zero','残差总为零']],'a','Different coefficient vectors can describe the same point.','不同系数向量可能描述同一点。','Orthogonal projection onto a subspace is unique, but kernel vectors can be added to x without changing Ax.','子空间上的正交投影唯一，但给 x 加上核中的向量不会改变 Ax，因此系数可能不唯一。')]);

D('M10.03',`A real symmetric matrix equals its transpose. The spectral theorem says that such a matrix has real eigenvalues and an orthonormal basis of eigenvectors. Thus A=QΛQᵀ, where Q is orthogonal and Λ is real diagonal. Orthogonal means QᵀQ=I, so changing to these coordinates preserves lengths and angles. This is stronger than ordinary diagonalizability, which may use a badly scaled nonorthogonal basis.

Why are different eigendirections perpendicular? If Au=λu and Av=μv, symmetry gives (Au)·v=u·(Av), so λ(u·v)=μ(u·v). When λ differs from μ, u·v must be zero. If an eigenvalue repeats, choose an orthonormal basis inside its eigenspace; every combination stays in that eigenspace, so orthogonalizing does not destroy the eigenvector property. The theorem also supplies existence of enough eigenvectors, which this short orthogonality calculation alone does not prove.

For A with rows (4,2),(2,4), the sum direction (1,1) scales by 6 and the difference direction (1,−1) scales by 2. Dividing both by √2 forms Q. A vector's squared length is the sum of squared coordinates in this basis, while xᵀAx becomes a weighted sum with weights 6 and 2. This connects the theorem to quadratic forms, principal axes and energy. For a nonsymmetric matrix, real eigenvalues alone do not guarantee an orthonormal eigenbasis.`, `实对称矩阵等于自身的转置。谱定理说明它的特征值均为实数，并且存在由特征向量组成的标准正交基。因此 A=QΛQᵀ，其中 Q 是正交矩阵，Λ 为实对角矩阵。QᵀQ=I，说明换到这一组坐标会保持长度和角度。它比普通可对角化更强，后者使用的基不一定正交，甚至可能数值上很不稳定。

不同特征值的方向为什么垂直？若 Au=λu、Av=μv，对称性给出 (Au)·v=u·(Av)，因此 λ(u·v)=μ(u·v)。当 λ≠μ，必有 u·v=0。重特征值的特征子空间内部可选标准正交基；由于线性组合仍在该特征子空间内，正交化不会破坏特征向量性质。谱定理还保证存在足够多的特征向量，这一点不能仅靠上述正交性计算证明。

例如 A 两行为 (4,2)、(2,4)，和方向 (1,1) 伸缩 6 倍，差方向 (1,−1) 伸缩 2 倍。各除以 √2 就得到 Q 的两列。在这组基下，长度平方仍是坐标平方和，而 xᵀAx 是以 6、2 为权重的平方和，因此可用于二次型、主轴和能量分析。非对称矩阵即使特征值全为实数，也未必有标准正交特征向量基。`, id=>[
 numeric(id+'.v2.1','A has rows (5,2),(2,5). What is the eigenvalue in direction (1,−1)?','A 的两行为 (5,2)、(2,5)。方向 (1,−1) 对应的特征值是多少？',3,'Multiply A by (1,−1) and compare the result.','计算 A(1,−1)，再比较倍数。','A(1,−1)=(3,−3)=3(1,−1).','A(1,−1)=(3,−3)=3(1,−1)。'),
 choice(id+'.v2.2','For a real symmetric matrix, eigenvectors belonging to distinct eigenvalues must be…','实对称矩阵中，不同特征值对应的特征向量必定……',[['a','parallel','平行'],['b','orthogonal','正交'],['c','equal in length','等长']],'b','Compare (Au)·v with u·(Av).','比较 (Au)·v 与 u·(Av)。','Symmetry gives (λ−μ)(u·v)=0. Distinct eigenvalues force the inner product to vanish; lengths remain freely scalable.','对称性给出 (λ−μ)(u·v)=0。不同特征值迫使内积为零，但长度可以任意缩放。')]);

D('M10.04',`Singular value decomposition applies to rectangular matrices as well as square ones. For a real m-by-n matrix, A=UΣVᵀ, with U and V orthogonal and Σ rectangular diagonal with nonnegative entries. Read this as three operations: choose perpendicular input coordinates, stretch selected directions, then choose perpendicular output coordinates. Unlike eigenvectors, the input and output directions may live in spaces of different dimensions.

To see where the stretches come from, consider AᵀA. It is symmetric, and vᵀAᵀAv equals the nonnegative squared length of Av. Its eigenvalues are therefore nonnegative. Choose orthonormal eigenvectors vᵢ and set σᵢ to the square root of each eigenvalue. For σᵢ>0, define uᵢ=Avᵢ/σᵢ. Their inner products show that the uᵢ are orthonormal. Complete the missing output directions to obtain U. A zero singular value identifies an input direction annihilated by A.

For a matrix that maps (x,y) to (4x,−y,0), the singular values are 4 and 1: the minus sign changes direction, not stretch magnitude. The number of positive singular values is the rank. Retaining only the largest stretches gives useful low-rank approximations; discarding a stretch deliberately loses its contribution. In solving inverse problems, dividing by a tiny singular value amplifies measurement error, so rank thresholds and regularization depend on data accuracy rather than on algebra alone.`, `奇异值分解既适用于方阵，也适用于长方形矩阵。对实 m×n 矩阵，A=UΣVᵀ，其中 U、V 正交，Σ 为非负对角元组成的长方形对角矩阵。可把它理解为：选取垂直的输入坐标，沿这些方向伸缩，再选取垂直的输出坐标。与特征向量不同，输入、输出方向甚至可以位于不同维数的空间。

伸缩倍数来自 AᵀA。它是对称矩阵，并且 vᵀAᵀAv 等于 Av 的长度平方，所以非负，因此其特征值非负。取标准正交特征向量 vᵢ，令 σᵢ 为对应特征值平方根。σᵢ>0 时，定义 uᵢ=Avᵢ/σᵢ；计算内积可知这些 uᵢ 标准正交，再补齐输出方向得到 U。零奇异值对应被 A 映为零的输入方向。

例如映射 (x,y)→(4x,−y,0) 的奇异值为 4、1；负号改变方向，不改变伸缩量。正奇异值的个数就是秩。只保留较大的伸缩方向可以得到低秩近似，但丢掉某个方向就确实丢掉了它的贡献。求逆问题中，除以极小奇异值会放大测量误差，因此截断阈值和正则化还需考虑数据精度，不能只依赖形式代数。`, id=>[
 numeric(id+'.v2.1','For A with diagonal entries −6 and 2, what is the largest singular value?','对角元为 −6、2 的矩阵 A，最大奇异值是多少？',6,'Square the entries in AᵀA, then take nonnegative square roots.','先考虑 AᵀA 中的平方，再取非负平方根。','AᵀA has eigenvalues 36 and 4; its singular values are 6 and 2.','AᵀA 的特征值为 36、4，所以奇异值为 6、2。'),
 numeric(id+'.v2.2','A has singular values 8,3,0,0. What is its rank?','A 的奇异值为 8、3、0、0，它的秩是多少？',2,'Count positive singular values, not all displayed values.','数正奇异值，而不是所有列出的数。','Two directions have nonzero stretch, so the image is two-dimensional and rank is 2.','两个方向的伸缩非零，因此像是二维，秩为 2。')]);

D('M10.05',`A quadratic form takes a vector and returns a homogeneous expression of degree two, such as 3x²+4xy+2y². Write it as xᵀAx using a symmetric matrix: the off-diagonal entry is half the coefficient of xy because two symmetric positions contribute that product. In fact any square matrix gives the same quadratic form as its symmetric part (A+Aᵀ)/2; its skew-symmetric part contributes zero.

Positive definite means the form is strictly positive on every nonzero vector. Positive semidefinite allows zero for some nonzero vectors but never a negative value. Negative versions reverse the signs. Indefinite means some inputs give positive values and others negative values. Testing a few convenient vectors cannot establish definiteness for every direction.

Use the spectral theorem: in orthonormal eigenvector coordinates, xᵀAx is a sum of eigenvalues times squared coordinates. All eigenvalues positive gives positive definiteness; all nonnegative gives semidefiniteness; a mixture of positive and negative gives indefiniteness. For a symmetric 2-by-2 matrix with entries a,b;b,c, positive definiteness is equivalent to a>0 and ac−b²>0. Completing the square gives a(x+by/a)²+(c−b²/a)y² when a is nonzero, explaining the criterion when a>0. Positive diagonal entries alone are insufficient: a large mixed term can create a negative direction. In optimization, a positive definite Hessian at a stationary point gives a strict local minimum under the usual twice-continuously-differentiable assumptions.`, `二次型将向量变成齐次二次表达式，例如 3x²+4xy+2y²。它可写成 xᵀAx，其中 A 取对称矩阵。非对角元应是 xy 系数的一半，因为两个对称位置都贡献同一个乘积。任何方阵的二次型都与其对称部分 (A+Aᵀ)/2 相同，反对称部分的贡献为零。

正定要求对所有非零向量取严格正值；半正定允许某些非零向量给零，但绝不取负值。负定、半负定把符号反过来。不定则表示有些输入为正、有些为负。仅试几个方便的向量，不能证明所有方向上的结论。

利用谱定理，在标准正交特征坐标中，xᵀAx 成为“特征值乘坐标平方”的和。所有特征值正则正定，全非负则半正定，正负都有则不定。对称 2×2 矩阵 a,b;b,c 正定的充要条件是 a>0 且 ac−b²>0。当 a≠0 时配方为 a(x+by/a)²+(c−b²/a)y²，a>0 时便解释了该判据。仅对角元为正不够，大的混合项仍可能产生负方向。在优化中，通常的二阶连续可微条件下，驻点处 Hessian 正定可保证严格局部极小。`, id=>[
 numeric(id+'.v2.1','For q(x,y)=2x²−2xy+3y², find q(2,1).','q(x,y)=2x²−2xy+3y²，求 q(2,1)。',7,'Evaluate the mixed term with its negative sign.','保留混合项的负号并代入。','2×4−2×2×1+3×1=8−4+3=7.','2×4−2×2×1+3×1=8−4+3=7。'),
 choice(id+'.v2.2','The symmetric matrix with rows (1,2),(2,1) is…','两行为 (1,2)、(2,1) 的对称矩阵是……',[['p','positive definite','正定'],['s','positive semidefinite','半正定'],['i','indefinite','不定']],'i','Try the vectors (1,1) and (1,−1).','分别试 (1,1)、(1,−1)。','The quadratic form takes values 6 and −2 on these vectors, so it has both signs. Positive diagonal entries did not suffice.','对应二次型分别取 6 和 −2，出现两种符号，因此不定。对角元全正并不足够。')]);

D('M10.06',`A matrix depends on a basis, but the linear map it represents does not. If columns of P are new basis vectors expressed in old coordinates, the same map has new matrix P⁻¹AP. Matrices related this way are similar. Similarity preserves eigenvalues, determinant, trace and ranks of powers, but generally does not preserve lengths of coordinate vectors because P need not be orthogonal.

Diagonal form is available only when eigenvectors supply a full basis. Over the complex numbers, Jordan form also handles the missing directions. A Jordan block has one eigenvalue along the diagonal and ones just above it. Its extra basis vectors are generalized eigenvectors: a chain satisfies (A−λI)v₁=0 and (A−λI)v₂=v₁, and may continue. The second vector is not an ordinary eigenvector; applying A mixes it with the earlier direction.

For J with rows (2,1),(0,2), write J=2I+N, where N²=0. Expanding J³ gives 8I+12N because terms containing N² vanish. Thus the upper-right entry grows with an additional polynomial factor, a feature that pure diagonal scaling misses. Block structure explains repeated modes in recurrences and differential equations. Jordan form is exact algebra over a field where the characteristic polynomial splits; tiny numerical perturbations can change its block structure. Numerical computation often uses more stable decompositions instead of trying to infer exact Jordan blocks from rounded data.`, `矩阵依赖于选定的基，线性映射本身却不依赖。若 P 的列是新基在旧坐标中的表示，则同一个映射在新基下的矩阵为 P⁻¹AP。这种关系称为相似。相似保持特征值、行列式、迹以及各次幂的秩，但一般不保持坐标向量的长度，因为 P 未必正交。

只有特征向量能够构成完整基时，才能化为对角形式。复数域上的 Jordan 形还能处理缺失的特征方向。每个 Jordan 块的对角线是同一特征值，其上方相邻位置为 1。额外的基向量是广义特征向量，构成链：(A−λI)v₁=0、(A−λI)v₂=v₁，还可继续。第二个并非普通特征向量，A 会将它与前一个方向混合。

例如 J 两行为 (2,1)、(0,2)，可写 J=2I+N，且 N²=0。展开 J³，因为含 N² 的项都消失，得到 8I+12N，因此右上角包含纯对角伸缩所没有的多项式增长因子。这种块结构有助于理解递推和微分方程中的重复模式。Jordan 形是在特征多项式能够完全分裂的数域上的精确代数描述；极小数值扰动可能改变块结构，因此不宜直接从舍入后的数据猜测精确 Jordan 块，数值计算常采用更稳定的分解。`, id=>[
 numeric(id+'.v2.1','J has rows (3,1),(0,3). Find the upper-right entry of J².','J 的两行为 (3,1)、(0,3)，求 J² 的右上角元素。',6,'Write J=3I+N and use N²=0.','写成 J=3I+N，使用 N²=0。','J²=9I+6N, so the upper-right entry is 6. Direct row-column multiplication gives 3×1+1×3=6.','J²=9I+6N，右上角为 6。直接行列相乘也得 3×1+1×3=6。'),
 choice(id+'.v2.2','Which quantity is always preserved by a general similarity transformation P⁻¹AP?','一般相似变换 P⁻¹AP 一定保持哪个量？',[['t','The trace','迹'],['e','Every matrix entry','每个矩阵元素'],['l','The length of every coordinate vector under P','P 作用下每个坐标向量的长度']],'t','Changing a basis preserves the underlying map, but P need not be orthogonal.','换基保留同一个映射，但 P 不一定正交。','Trace is invariant under similarity. Entries depend on the basis, and lengths require an orthogonal change of coordinates to be preserved for all vectors.','迹在相似变换下不变。矩阵元素依赖于基；要保持所有向量长度，坐标变换还需正交。')]);

export function enrichLinearLesson(lesson){
  const detail=details.get(lesson.id);
  if(!detail)return lesson;
  const extraSource=lesson.id==='module.M10.04'?{title:'MIT — Singular value decomposition',url:'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/singular-value-decomposition/'}:lesson.id==='module.M10.06'?{title:'MIT — Generalized eigenspaces',url:'https://ocw.mit.edu/courses/18-700-linear-algebra-fall-2013/resources/mit18_700f13_generalized/'}:null;
  return {...lesson,minutes:35,prerequisites:lesson.id==='module.M10.06'?[...lesson.prerequisites,'module.M05.01']:lesson.prerequisites,sections:lesson.sections.map((section,i)=>i===1?{type:'concept',title:B('How the idea works','理解它为什么成立'),body:detail.body}:section),exercises:detail.checks(lesson.id),sources:extraSource?[...lesson.sources,extraSource]:lesson.sources};
}
