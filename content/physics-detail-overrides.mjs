const B=(en,zh)=>({en,zh});
const details=new Map();
function D(module,en,zh,q,qzh,answer,hint,hintzh,solution,solutionzh){details.set('module.'+module,{body:B(en,zh),exercise:{id:'module.'+module+'.transfer-v2',type:'numeric',prompt:B(q,qzh),answer,hints:[B(hint,hintzh)],explanation:B(solution,solutionzh)}});}

D('P01.01',`Choose an origin and a positive axis before assigning a position x. Position is a coordinate; displacement is the final coordinate minus the initial one. Distance counts the whole path and cannot be negative. A runner going 6 m right and 2 m left travels 8 m but has displacement +4 m. Average velocity uses displacement divided by elapsed time, whereas average speed uses distance. They answer different questions.

On a position–time graph, slope gives velocity. A horizontal segment represents rest, not motion along a horizontal road. On a velocity–time graph, slope gives acceleration and signed area gives displacement. Negative area means travel in the negative coordinate direction. The magnitude of velocity is speed; velocity and acceleration with opposite signs reduce speed until velocity reaches zero.

When acceleration is constant, the velocity graph is a straight line, so its area is a rectangle plus a triangle. This gives displacement ut+at²/2 and final velocity u+at. Eliminating time gives v²=u²+2as, but squaring loses information about velocity's sign. Check the direction separately. These formulas cannot be used with one instantaneous acceleration when acceleration varies throughout the interval; then graph areas or integration are required.`, `先选原点与正方向，再给位置 x 赋值。位置是坐标，位移是终坐标减初坐标；路程则累计整条路径，不会为负。一个人先向右走 6 m，再向左走 2 m，路程为 8 m，位移却为 +4 m。平均速度用位移除以时间，平均速率用路程除以时间，两者回答的问题不同。

位置—时间图像的斜率表示速度，水平线段表示静止，而不是沿水平道路行驶。速度—时间图像的斜率表示加速度，有符号面积表示位移。负面积代表向负方向移动。速率是速度的大小；速度与加速度异号时，速率减小，直至速度降到零。

加速度恒定时，速度图像为直线，面积可分成矩形与三角形，得到位移 ut+at²/2 和末速度 u+at。消去时间可得 v²=u²+2as，但平方丢失了速度的符号，方向需另行判断。如果加速度随时间变化，就不能把某一瞬间的加速度直接代入这些公式，应使用图像面积或积分。`,
'A cart has initial velocity +10 m/s and constant acceleration −2 m/s² for 3 s. Find its displacement in m.','小车初速度 +10 m/s，以 −2 m/s² 匀加速运动 3 s，位移是多少米？',21,'Use signed quantities in ut+at²/2; the cart has not yet reversed.','带符号代入 ut+at²/2；这段时间内小车还没有反向。','s=10×3−2×9/2=21 m. Its final velocity is +4 m/s.','s=10×3−2×9/2=21 m，末速度为 +4 m/s。');

D('P01.02',`A position vector tells how far to move along each chosen coordinate axis. Different axes describe the same physical path with different components. At every instant, velocity points along the tangent to the path, while acceleration describes a change of velocity that may affect magnitude, direction, or both. A curved path can therefore have acceleration even when speed is constant.

Resolve every vector equation into perpendicular components and solve all components with the same clock. For a projectile close to Earth's surface, assume uniform downward gravity and negligible air resistance. Then horizontal acceleration is zero and vertical acceleration is −g if upward is positive. The horizontal coordinate is x₀+uₓt, and the vertical coordinate is y₀+uᵧt−gt²/2. The flight time comes from the vertical condition for landing; substitute that same time into the horizontal equation.

At the highest point of an angled projectile, vertical velocity is zero but horizontal velocity generally is not. Acceleration remains downward. In three dimensions, there are three component equations rather than a new kind of force law. A vector's magnitude is found by the Pythagorean sum of its perpendicular components; adding component magnitudes would describe a different quantity. With drag, the force may depend on the full velocity, so the simple separated projectile formulas require revision.`, `位置向量说明沿各坐标轴分别移动多少。换一组坐标轴，会给同一条物理路径不同的分量。每一瞬间，速度沿轨迹切线；加速度描述速度的变化，可能改变大小、方向，或两者都改变。因此即使速率不变，曲线运动也可能有加速度。

把向量方程分解到垂直坐标轴上，并对所有分量使用同一个时钟。近地抛体的简化模型假设重力均匀向下且空气阻力可忽略。若向上为正，水平加速度为零，竖直加速度为 −g。于是 x=x₀+uₓt，y=y₀+uᵧt−gt²/2。先由落地的竖直位置条件求时间，再把同一时间代入水平式。

斜抛最高点的竖直速度为零，但水平速度一般不为零；加速度仍然向下。三维运动只是多出一个分量方程，并没有换一套力学定律。向量大小由垂直分量的平方和开平方得到，不能直接把分量大小相加。若考虑阻力，力可能依赖完整速度，此时简单的分离抛体公式必须修改。`,
'A ball is launched horizontally at 6 m/s from a height of 20 m. Neglect drag and use g=10 m/s². Find its horizontal range in m.','小球从 20 m 高处以 6 m/s 水平抛出，忽略空气阻力，g=10 m/s²，水平射程是多少米？',12,'Find fall time from 20=gt²/2, then use horizontal speed.','先由 20=gt²/2 求下落时间，再乘水平速度。','20=5t² gives t=2 s. The horizontal range is 6×2=12 m.','20=5t² 得 t=2 s，水平射程为 6×2=12 m。');

D('P01.03',`A free-body diagram isolates one chosen object and lists forces exerted on it by other objects. Draw weight from the Earth, contact forces from surfaces, tension from a taut string, and any specified applied forces. Velocity and acceleration are not forces and do not belong in the force sum. Label each force by its interaction partner to avoid accidentally counting the same interaction twice.

Newton's first law identifies inertial frames: without a resultant force, velocity is constant, including the possibility of zero velocity. Newton's second law then relates resultant force to acceleration for a constant-mass body. Resolve the force sum along convenient axes. A zero vertical acceleration gives a vertical balance even while a horizontal resultant produces horizontal acceleration. This is why the normal force sometimes equals weight, but only after other vertical forces and vertical acceleration have been considered.

The third law compares an interaction across two bodies. If a hand pushes a cart, the cart pushes the hand equally and oppositely; only the hand-on-cart force belongs on the cart's diagram. When both bodies are included in one system, their mutual forces cancel in the total momentum balance. An object moving left with acceleration right initially slows down; the net force describes the change of velocity, not its current direction.`, `受力图要先孤立一个研究对象，再列出其他物体对它施加的力，包括地球施加的重力、接触面施加的接触力、绷紧绳子的拉力，以及题目给出的外力。速度和加速度不是力，不能加入力的总和。标明每个力的施力对象，可避免把同一相互作用算两遍。

牛顿第一定律识别惯性参考系：合力为零时，速度不变，包括速度为零的情形。对质量恒定的物体，第二定律把合力与加速度联系起来。可沿方便的轴分别列方程。竖直加速度为零意味着竖直方向力平衡，而水平方向仍可有合力和加速度。因此支持力有时等于重力，但必须先检查其他竖直力与竖直加速度，不能直接套用。

第三定律比较两个物体之间的一次相互作用。手推车时，车也以等大反向的力推手；车的受力图中只画手对车的力。若把两者一起选为系统，它们之间的内力会在总动量方程中抵消。向左运动却向右加速的物体会先减速；合力说明速度如何改变，而不是速度当前朝向哪里。`,
'A 4 kg cart has a 19 N force to the right and a 7 N force to the left. Taking right as positive, find acceleration in m/s².','4 kg 小车受向右 19 N 与向左 7 N 两个力，以右为正，加速度是多少 m/s²？',3,'Sum signed horizontal forces before dividing by mass.','先求带符号的水平合力，再除以质量。','The resultant is 19−7=12 N, so a=12/4=+3 m/s².','合力为 19−7=12 N，所以 a=12/4=+3 m/s²。');

D('P01.04',`A contact force can be separated into a normal component perpendicular to the surface and a friction component tangent to it. Neither component is automatically equal to the object's weight. On an incline, choosing axes along and perpendicular to the slope makes the weight components easy to distinguish: the perpendicular balance determines the normal force, while the parallel balance determines possible acceleration or friction.

For dry static contact, first solve the equilibrium or no-slip equations to find the friction that would be needed. Then compare its magnitude with the limit μₛN. If the required value is below the limit, that required value is the actual static friction. Setting friction equal to its maximum from the beginning would usually give a wrong force balance. If the required value exceeds the limit, the no-slip assumption fails and a sliding model must be considered.

Sliding friction in the simple Coulomb model has magnitude μₖN and opposes relative sliding of the touching surfaces. That direction may differ from the direction opposite the object's centre-of-mass velocity: a moving belt can accelerate a box through forward friction. Friction coefficients are empirical approximations, affected by materials and conditions. Adhesion, lubrication, deformation and high-speed effects can make the simple constant-coefficient model unsuitable. Always state which contact regime you are using.`, `接触力可分解为垂直于表面的支持力和沿表面的摩擦力，两者都不自动等于物体重力。斜面问题中，沿斜面及垂直斜面选轴，可以清楚区分重力分量：垂直方向方程决定支持力，平行方向方程决定加速度或所需摩擦力。

对干燥静接触，应先按平衡或无相对滑动条件求所需摩擦力，再与上限 μₛN 比较。若所需大小不超过上限，实际静摩擦力就是这个所需值。若一开始就令静摩擦力等于最大值，通常会列错方程。若所需值超过上限，无滑动假设失效，需要改用滑动模型。

简单库仑模型中的滑动摩擦力大小为 μₖN，方向阻碍两个接触面之间的相对滑动。这未必等同于阻碍物体质心运动，例如运动的传送带可通过向前的摩擦力使箱子加速。摩擦系数是受材料与条件影响的经验近似；黏附、润滑、形变或高速效应可能让恒定系数模型失效。解题时应说明采用哪一种接触状态。`,
'A stationary box needs 9 N of horizontal friction to remain at rest. Its normal force is 50 N and μs=0.3. Find the actual static friction magnitude in N.','静止箱子需要 9 N 水平摩擦力才能保持静止，支持力 50 N，μs=0.3。实际静摩擦力大小是多少牛？',9,'Compare the required force with the maximum; do not automatically use the maximum.','比较所需值与最大值，不要直接把最大值当实际值。','The maximum is 0.3×50=15 N. The required 9 N is possible, so actual friction is 9 N.','上限为 0.3×50=15 N，所需 9 N 没超过上限，因此实际大小为 9 N。');

D('P01.05',`Following a circle requires the velocity vector to rotate. Even at constant speed, velocities at nearby points differ in direction; taking the rate of that change gives inward acceleration v²/r. If speed also changes, add a tangential acceleration. These components are perpendicular and serve different purposes: the radial component bends the path, while the tangential component changes speed.

Choose the inward radial direction as positive and sum the components of real forces in that direction. Set that resultant equal to mv²/r. Do not draw a separate extra force named centripetal force; it is a role played by the radial resultant of gravity, tension, contact forces, or other interactions. For a car turning on a flat road, static friction may supply the entire horizontal radial resultant, so a maximum available friction implies a maximum possible turning speed.

A constraint is a condition on allowed motion, but the forces maintaining it have limits. A flexible string pulls and cannot push. A surface can usually push an object away from itself, not pull it into contact. A calculated negative tension or impossible contact force means the assumed constrained motion cannot continue. In a vertical circle, weight's radial component changes around the path, so tension can change even when speed is prescribed to remain constant.`, `沿圆周运动要求速度向量持续转向。即使速率恒定，相邻位置的速度方向也不同；这种变化率给出向心加速度 v²/r。若速率也变化，还需切向加速度。二者垂直，作用不同：径向分量使轨迹弯曲，切向分量改变速率。

以指向圆心的径向为正，把真实力在该方向上的分量相加，令其合力等于 mv²/r。不要额外画一个叫“向心力”的力；它只是重力、拉力、接触力等的径向合力所承担的作用。汽车在水平路面转弯时，静摩擦力可能提供全部水平向心合力，因此最大摩擦力也限制可保持转弯的最大速率。

约束描述允许怎样运动，但维持约束的力存在限制。软绳只能拉，不能推；普通接触面一般只能把物体推出自身，不能把物体拉回接触。若算出负拉力或不可能的支持力，说明原先假定的约束运动无法继续。竖直圆周中，重力的径向分量随位置变化，所以即使人为规定速率恒定，拉力仍会变化。`,
'A 2 kg object moves at 8 m/s in a circle of radius 4 m. Find the inward resultant force in N.','2 kg 物体以 8 m/s 沿半径 4 m 的圆周运动，径向合力是多少牛？',32,'Use mass times v²/r, not mass times v/r.','用质量乘 v²/r，不是质量乘 v/r。','The acceleration is 64/4=16 m/s², so the resultant is 2×16=32 N.','加速度为 64/4=16 m/s²，合力为 2×16=32 N。');

D('P01.06',`Motion is always described relative to a reference frame. A position can change merely because the observer's origin moves. In ordinary Newtonian mechanics, if a frame translates at constant velocity V, its coordinates satisfy x′=x−Vt after matching origins at time zero. Differentiating gives v′=v−V, while acceleration is unchanged. Thus two inertial observers may disagree about velocity but use the same acceleration in Newton's second law.

For a translating frame whose origin accelerates at A, acceleration transforms as a′=a−A. Keeping the equation in the form ma′=sum of forces requires an additional inertial term −mA. This term reflects the frame choice rather than a new interaction with another body. Rotating frames need further terms, so the simple translating-frame formula is not the complete account of a spinning platform.

Check every result against its model. Dimensions must match on both sides, but dimensionally correct equations can still be false. A predicted friction force must respect the contact regime; a flight time must fit the actual landing condition; a limiting result should make sense when a parameter becomes small. Galilean transformations assume speeds far below light speed. Uncertainty in measured inputs also limits the precision with which a numerical prediction should be reported.`, `运动总是相对于某个参考系描述的。仅仅因为观察者原点移动，位置坐标就可能变化。普通牛顿力学中，若新参考系以恒定速度 V 平移，并使初始原点重合，则 x′=x−Vt。求时间变化率得 v′=v−V，而加速度不变。因此两个惯性观察者可以得到不同速度，却在牛顿第二定律中使用相同加速度。

若平移参考系的原点有加速度 A，则 a′=a−A。要仍写成 ma′=力的总和，就需加入惯性项 −mA。它来自参考系选择，而不是与另一个物体发生了新的相互作用。旋转参考系还需要其他项，不能仅用平移参考系公式描述旋转平台。

计算完应检查模型：等式两边量纲必须一致，但量纲一致仍不足以保证正确。摩擦力需符合接触状态，飞行时间需符合实际落地条件，参数变小时极限结果应合理。伽利略变换适用于远低于光速的速度范围。输入测量的不确定度，也限制了数值结果可报告的精度。`,
'A platform moves east at 12 m/s. A person moves west at 3 m/s relative to the platform. Taking east positive, find ground velocity in m/s.','平台以 12 m/s 向东运动，人相对平台以 3 m/s 向西走。以东为正，人相对地面的速度是多少 m/s？',9,'Add signed relative velocity to platform velocity.','把带符号的相对速度加到平台速度上。','The ground velocity is 12+(−3)=+9 m/s, still eastward.','相对地面速度为 12+(−3)=+9 m/s，仍向东。');

D('P02.01',`Work measures energy transferred by a force acting through displacement. For a constant force, only its component parallel to the displacement contributes: W=Fs cos θ. A force perpendicular to instantaneous motion does no work at that instant, even though it can bend the trajectory. A force opposing motion does negative work. For a changing force or a curved path, accumulate small contributions F·dr along the actual path.

The work–kinetic-energy theorem follows from Newton's second law for a constant-mass particle. For constant force along a straight displacement, v²−u²=2as and F=ma give Fs=m(v²−u²)/2. Thus total work equals the change in mv²/2. A changing force can be handled by adding contributions over many small displacements; calculus later makes this general argument precise. It is the work of the resultant, or the sum of work from all forces, that equals this change. One force's work need not equal the kinetic-energy change when other forces also act.

For a cart moving right under a rightward push and leftward friction, the push contributes positive work and friction negative work. If their magnitudes balance, kinetic energy can stay constant despite energy being transferred from the pusher into thermal energy. Power is work per unit time; instantaneous power is F·v. Two machines can deliver the same work with different power by taking different times.`, `功描述力通过位移转移的能量。恒力时，只有沿位移方向的分量贡献功，即 W=Fs cos θ。与瞬时运动方向垂直的力，在该瞬间不做功，但仍能使轨迹转弯；阻碍运动的力做负功。力变化或路径弯曲时，要沿实际路径累计微小贡献 F·dr。

对质量恒定的质点，动能定理可由牛顿第二定律推出。恒力沿直线位移作用时，由 v²−u²=2as 和 F=ma 得到 Fs=m(v²−u²)/2，即总功等于 mv²/2 的变化。对于变化的力，可以将许多小位移上的贡献相加，之后用微积分严格处理一般情况。这里必须是合力的功，或所有力所做功的和；还有其他力作用时，单个力做的功未必等于动能变化。

向右行驶的小车若受向右推力与向左摩擦力，推力做正功，摩擦力做负功。两者大小平衡时，动能可保持不变，但推动者的能量仍不断转移为热能。功率是单位时间的功，瞬时功率为 F·v。两台机器可以做相同的功，却因耗时不同而功率不同。`,
'A 2 kg cart starts at 3 m/s. The total work on it is 16 J. Find its final speed in m/s.','2 kg 小车初速率 3 m/s，所有力对它做的总功为 16 J，末速率是多少 m/s？',5,'Add the total work to the initial kinetic energy.','将总功加到初动能上。','Initial kinetic energy is 9 J; final kinetic energy is 25 J. Since mv²/2=v² for m=2 kg, final speed is 5 m/s.','初动能为 9 J，末动能为 25 J；质量为 2 kg 时 mv²/2=v²，因此末速率为 5 m/s。');

D('P02.02',`A conservative force does work that depends only on the endpoints of a path. Its work around a closed path is zero. This allows a potential-energy function U to record the interaction: the force's work equals minus the change in U. Potential energy belongs to an interacting system, such as a mass and the Earth or a spring and the object attached to it, rather than to speed alone.

Near Earth's surface, with approximately constant g, raising a mass by height h changes gravitational potential energy by mgh. An ideal spring stretched or compressed by x stores kx²/2 relative to its relaxed state. The reference value of U is arbitrary, but differences are physically useful. Changing the zero shifts all stated energies by the same constant and does not alter forces or predicted speeds.

When conservative forces do all the work, the work–energy theorem becomes Δ(K+U)=0. With additional nonconservative work, use Δ(K+U)=Wnonconservative for the chosen particle model and explicitly tracked conservative potentials. Sliding friction can lower mechanical energy while increasing internal thermal energy; total energy has not disappeared. A force balance and an energy balance answer different questions: energy often relates speeds at two positions efficiently, while the time taken or contact forces may still require Newton's laws.`, `保守力所做的功只依赖路径端点，沿闭合路径一周的功为零。因此可以用势能函数 U 记录这种相互作用，保守力的功等于势能变化的负值。势能属于相互作用系统，例如物体与地球、弹簧与连接物体，而不是仅由速率决定。

近地面 g 可近似恒定时，升高 h 所对应的重力势能变化为 mgh。理想弹簧相对自然长度伸长或压缩 x，储存弹性势能 kx²/2。势能零点可任意选，但势能差有物理作用。更换零点只会给所有势能加同一个常数，不会改变力或预测速率。

只有保守力做功时，动能定理变为 Δ(K+U)=0。若还存在其他非保守力做功，在所选质点模型与已计入的势能项下，应使用 Δ(K+U)=W非保守。滑动摩擦可以降低机械能并提高内能，总能量并未消失。受力分析与能量分析回答的问题不同：能量常能高效联系两个位置的速率，但运动时间、支持力等仍可能需要牛顿定律。`,
'An object starts from rest and drops 3.2 m without drag. Use g=10 m/s². Find its final speed in m/s.','物体从静止无阻力下落 3.2 m，g=10 m/s²，末速率是多少 m/s？',8,'Set mgh equal to mv²/2; the mass cancels.','令 mgh=mv²/2，质量可以约去。','v²=2gh=2×10×3.2=64, so speed is 8 m/s.','v²=2gh=2×10×3.2=64，因此速率为 8 m/s。');

D('P02.03',`Momentum combines mass with signed velocity. In more than one dimension it is a vector, so add components rather than speeds. Impulse is the accumulated force over a time interval; for a constant or correctly averaged force it is FΔt. Newton's law relates external impulse to the change in a system's total momentum. A large force acting briefly and a smaller force acting longer can produce the same impulse.

Choose the colliding objects together as the system. Their mutual impact forces are internal and cancel in the total momentum equation. If external impulse is negligible during the short collision, total momentum before and after is equal. This does not require kinetic energy to be conserved. In an elastic collision both momentum and kinetic energy are conserved; a perfectly inelastic collision has the objects stick together. Deformation, heating and sound account for the missing macroscopic kinetic energy.

For sticking in one dimension, the shared final velocity is the initial total momentum divided by combined mass. Signed directions matter: opposite momenta can cancel, leaving a stationary combined object even though both initially moved. The collision calculation does not automatically describe the later motion if external forces subsequently act. In injury protection, increasing stopping time for a fixed momentum change reduces average force, although the detailed peak force also depends on how the force varies.`, `动量是质量与带方向速度的乘积。在多维问题中它是向量，应按分量相加，不能直接加速率。冲量是某段时间内力的累计；恒力或正确取平均后可写为 FΔt。牛顿定律把外力冲量与系统总动量变化联系起来。大力短时作用与小力长时作用，可以产生相同冲量。

将碰撞的物体一起选为系统，它们之间的碰撞力是内力，在总动量方程中抵消。短暂碰撞过程中，若外力冲量可忽略，总动量前后相等，但这不要求动能守恒。弹性碰撞同时守恒动量与动能；完全非弹性碰撞中，物体碰后粘在一起。宏观动能的减少可对应形变、内能或声音等。

一维粘连碰撞的共同末速度，等于初始总动量除以总质量。必须保留方向符号：相反动量可相消，因此原先都运动的两物体粘连后可能静止。若碰后继续受外力，这次碰撞计算不自动给出后续全部运动。缓冲保护中，固定动量变化下延长停止时间可减小平均力，但峰值力仍取决于力随时间的具体变化。`,
'A 2 kg cart moving at +5 m/s sticks to a 3 kg cart moving at −1 m/s. External impulse is negligible. Find their final velocity in m/s.','2 kg 小车以 +5 m/s 运动，与以 −1 m/s 运动的 3 kg 小车粘连。外力冲量可忽略，共同末速度是多少 m/s？',1.4,'Add signed momenta before dividing by the combined mass.','先求带符号的总动量，再除以总质量。','Initial momentum is 2×5+3×(−1)=7 kg·m/s. The combined mass is 5 kg, so final velocity is +1.4 m/s.','初动量为 2×5+3×(−1)=7 kg·m/s，总质量 5 kg，末速度为 +1.4 m/s。');

D('P02.04',`The centre of mass is a weighted average of positions, with each mass providing its weight in the average. In one dimension xCM=(m₁x₁+m₂x₂+⋯)/M, where M is total mass. Use the same origin for every coordinate. A heavier object pulls the average toward its own location. For an extended object, split it into small masses or use symmetry; a uniform ring's centre lies in its empty middle.

For a system of constant total mass, total momentum equals M times centre-of-mass velocity. Adding the particles' equations of motion cancels their internal action–reaction forces and gives M aCM=Fexternal. A complicated object may rotate, vibrate or break apart while its centre of mass follows a simple trajectory determined by the external resultant. After a projectile breaks into fragments, the centre of mass still follows the original gravity-only trajectory if drag is neglected.

This does not mean all of the system's kinetic energy is the kinetic energy of its centre. There can also be motion relative to that centre. Two equal masses moving oppositely have a stationary centre but positive total kinetic energy. If mass enters or leaves the chosen system, carefully account for momentum carried across its boundary; a rocket cannot be analyzed by blindly applying a constant-mass centre-of-mass formula to the shrinking rocket alone.`, `质心是以质量为权重的位置平均。一维中 x质心=(m₁x₁+m₂x₂+⋯)/M，M 为总质量，所有坐标必须使用同一个原点。较重物体会使平均位置更靠近自己。对有大小的物体，可分成小质量块或利用对称性；均匀圆环的质心位于中间没有材料的区域。

总质量恒定时，系统总动量等于 M 乘以质心速度。把各质点运动方程相加，内部相互作用力两两抵消，得到 M a质心=F外。复杂物体可以转动、振动、碎裂，但质心仍按外力合力决定的较简单轨迹运动。例如忽略阻力时，抛体破裂成碎片后，所有碎片的质心仍沿原来的重力抛物线运动。

这不代表系统全部动能都等于质心平动动能。系统还可以有相对质心的运动。两个等质量物体反向运动，质心可静止，总动能却为正。若质量穿过系统边界，还要考虑它带入或带出的动量；不能仅把质量不断减小的火箭本体，机械地代入恒定质量公式。`,
'A 2 kg mass is at x=1 m and a 6 kg mass at x=5 m. Find the centre-of-mass position in m.','2 kg 质量位于 x=1 m，6 kg 质量位于 x=5 m，质心坐标是多少米？',4,'Use a mass-weighted mean rather than the midpoint.','使用质量加权平均，而不是直接取中点。','xCM=(2×1+6×5)/(2+6)=32/8=4 m.','x质心=(2×1+6×5)/(2+6)=32/8=4 m。');

D('P02.05',`A force's rotational effect depends on where it acts and on the axis being considered. Its torque magnitude is force times perpendicular distance from the axis to the force's line of action. Pulling directly toward a pivot gives zero torque about that pivot, even if the force is large. In three dimensions the cross product r×F encodes the perpendicular direction using the right-hand rule; opposite turning senses have opposite signs along a chosen axis.

Moment of inertia measures resistance to angular acceleration about a specified axis. For point masses it is the sum of mr², where r is each mass's perpendicular distance to that axis. Moving the same mass farther out increases I without changing total mass. For a rigid body rotating about a fixed axis with constant I, the net external torque component along that axis equals Iα, and rotational kinetic energy is Iω²/2.

Angular momentum about an origin is r×p for a particle. External torque changes total angular momentum about a fixed inertial origin. When that torque vanishes, angular momentum is conserved, even if internal motions redistribute mass. A skater pulling their arms inward can increase angular speed while reducing I. Their rotational kinetic energy need not stay constant: muscles do internal work. Always keep the axis and conservation conditions explicit rather than treating I as a property of mass alone.`, `力的转动作用取决于作用位置和所选转轴。力矩大小等于力乘以转轴到力作用线的垂直距离。即使力很大，若直接指向支点，对该支点的力矩仍为零。三维中的叉积 r×F 用右手定则表示垂直方向；沿指定转轴看，相反转动趋势应取相反符号。

转动惯量衡量绕指定轴改变角速度的难易程度。质点系中 I 为各个 mr² 之和，r 是质量点到转轴的垂直距离。将同样的质量移得更远，会增大 I，但不会改变总质量。刚体绕固定轴转动且 I 恒定时，外力矩沿该轴的分量等于 Iα，转动动能为 Iω²/2。

质点关于原点的角动量是 r×p。关于固定惯性原点的总角动量变化由外力矩决定；外力矩为零时，即使内部重新分配质量，总角动量仍守恒。滑冰者收拢双臂，I 减小，角速度可增大。但转动动能未必守恒，因为肌肉做了内功。应始终说明转轴和守恒条件，不能把 I 当成只由总质量决定的量。`,
'A rotor has I=4 kg·m² and angular speed 3 rad/s. Its inertia changes to 2 kg·m² with zero external torque about its fixed axis. Find final angular speed in rad/s.','转子 I=4 kg·m²，角速度 3 rad/s。关于固定轴的外力矩为零，转动惯量变为 2 kg·m²，末角速度是多少 rad/s？',6,'Conserve angular momentum Iω, not kinetic energy.','守恒的是角动量 Iω，不是动能。','Initial angular momentum is 4×3=12 kg·m²/s. Thus final angular speed is 12/2=6 rad/s.','初角动量为 4×3=12 kg·m²/s，因此末角速度为 12/2=6 rad/s。');

D('P02.06',`Rolling combines translation of the centre of mass with rotation about that centre. For a circular wheel on a stationary surface, no slipping means the contacting material point has zero instantaneous velocity relative to the surface. The translational and rotational velocities cancel there, giving vCM=ωR. The top of the rim instead moves at twice the centre speed in this ideal picture. A slipping wheel does not satisfy the same relation.

The kinetic energy is the sum of centre-of-mass translation and rotation about the centre. For a uniform solid disk, ICM=MR²/2, so pure rolling has kinetic energy 3MvCM²/4. Different mass distributions produce different rotational energy at the same centre speed. On an ideal fixed rigid surface, static friction can provide the torque needed for rolling without dissipating mechanical energy at the stationary contact; deformation and rolling resistance are additional effects.

Rigid-body equilibrium requires both translational and rotational balance. Sum forces to zero and torques to zero about one convenient point, using consistent signs and perpendicular lever arms. Choosing a support as the torque origin removes that support's unknown force from the torque equation. Equal opposite forces at different locations can form a couple: zero resultant force but a nonzero turning effect. A zero force sum alone therefore cannot establish equilibrium.`, `滚动同时包含质心平动和绕质心转动。圆轮在静止表面上无滑动时，接触处的材料点相对表面的瞬时速度为零。该点的平动速度与转动速度抵消，得到 v质心=ωR；同一理想模型中，轮缘顶部的速率则是质心速率的两倍。发生打滑时不能继续使用这个约束。

动能是质心平动动能与绕质心转动动能之和。均匀实心圆盘 I质心=MR²/2，因此纯滚动动能为 3Mv质心²/4。相同质心速率下，不同质量分布会产生不同转动动能。理想静止刚性表面上的静摩擦可以提供滚动所需力矩，而不在瞬时静止的接触点耗散机械能；形变、滚动阻力等则是额外效应。

刚体平衡同时要求平动力与力矩平衡。将力的和、关于方便选定点的力矩和都设为零，统一正负号，并使用垂直力臂。把支点选为力矩原点，可让该支点未知支持力不出现在力矩方程中。不同位置的等大反向力可能构成力偶，合力为零却仍有转动作用，因此仅合力为零不足以证明平衡。`,
'A uniform solid disk of mass 4 kg rolls without slipping at centre speed 2 m/s. Using ICM=MR²/2, find total kinetic energy in J.','质量 4 kg 的均匀实心圆盘以质心速率 2 m/s 无滑动滚动，I质心=MR²/2，总动能是多少焦？',12,'Add translational energy Mv²/2 and rotational energy Mv²/4.','把平动动能 Mv²/2 与转动动能 Mv²/4 相加。','Translation contributes 8 J and rotation 4 J, for a total of 12 J.','平动贡献 8 J，转动贡献 4 J，总计 12 J。');

D('P03.01',`Newton's gravitational law describes an attractive force between point masses, with magnitude GMm/r² along the line joining them. Here r is centre-to-centre separation, not height above a surface. Outside a spherically symmetric body, its gravitational field is the same as if all its mass were at its centre. Inside the material, that shortcut generally changes. Fields from different sources add as vectors.

Near a planet's surface, g=GM/r² changes little over small height ranges, explaining the approximately constant g used in elementary mechanics. For a small satellite in a circular orbit about a much heavier body, gravity supplies the inward resultant. Equating GMm/r² to mv²/r cancels the satellite mass and gives v²=GM/r. The orbital period is circumference divided by speed, so its square is proportional to r³.

Orbiting is free fall with enough sideways motion that the object keeps missing the planet. Apparent weightlessness does not imply absent gravity. With gravitational potential zero at infinity, U=−GMm/r: moving outward increases U toward zero. Escape requires enough initial energy to reach infinity with nonnegative kinetic energy in the ideal isolated model. Real orbits can be elliptical, involve additional bodies, or require relativistic corrections; the circular Newtonian formulas have specific assumptions.`, `牛顿引力定律描述质点间沿连线的吸引力，大小为 GMm/r²。r 是两质量中心间的距离，不是离表面的高度。在球对称天体外部，引力场等效于质量集中在球心；进入天体内部后，一般不能原样使用这种捷径。多个引力源的场要按向量叠加。

近地表的小高度范围内，g=GM/r² 变化不大，因此基础力学常把 g 看成常量。小卫星绕远重于自己的天体作圆轨道运动时，引力提供径向合力。令 GMm/r²=mv²/r，卫星质量约去，得到 v²=GM/r。周期是圆周长除以速率，因此周期平方与 r³ 成正比。

轨道运动是带有足够侧向速度的自由落体，使物体不断“落空”天体表面。表观失重并不表示没有引力。将无穷远势能设为零时，U=−GMm/r；向外移动使势能趋近零。在理想孤立模型中，逃逸要求初始能量足以使物体到无穷远时动能非负。真实轨道还可能是椭圆，受多个天体影响，或需要相对论修正；圆轨道牛顿公式有明确适用条件。`,
'Two circular orbits around the same dominant mass have radii r and 4r. If speed at r is 12 km/s, find speed at 4r in km/s.','绕同一主导质量天体的两个圆轨道半径为 r、4r，半径 r 处速率为 12 km/s，4r 处速率是多少 km/s？',6,'Circular orbital speed is proportional to the inverse square root of radius.','圆轨道速率与半径的平方根成反比。','Increasing radius fourfold divides speed by √4=2, so the new speed is 6 km/s.','半径增为四倍，速率除以 √4=2，因此为 6 km/s。');

D('P03.02',`Pressure is normal force per unit area. In a fluid at rest, a small parcel must have balanced forces; otherwise it would accelerate. The lower surface of a vertical parcel must support the downward pressure force from above as well as the parcel's weight. For constant density this balance gives p=pSurface+ρgh, with depth h measured downward from the free surface. Pressure depends on depth, not on the container's shape. Absolute pressure includes the atmosphere; gauge pressure subtracts the surrounding atmospheric pressure.

Pressure forces act perpendicular to every part of an immersed object's surface. Because pressure increases downward, the upward force on the lower parts exceeds the downward contribution on the upper parts. The resultant buoyant force equals the weight of the fluid displaced. One way to justify this is to replace the object with an imaginary parcel of the surrounding fluid: that parcel would be in equilibrium under the same surface-pressure forces and its own weight.

An object floating freely at rest displaces fluid whose weight equals its own. Its submerged volume adjusts until buoyancy balances gravity. For a uniform object in one liquid, the submerged fraction is object density divided by liquid density, provided this ratio is below one. A fully submerged object has a fixed displaced volume; if its weight exceeds buoyancy, another upward force is needed for equilibrium.`, `压强是单位面积上的法向力。静止流体中的小流体块必须受力平衡，否则就会加速。竖直流体块的下表面所受压力，需要同时平衡上表面向下的压力和自身重力。密度恒定时，由平衡得到 p=p表面+ρgh，其中 h 从自由液面向下计量。压强取决于深度，而不是容器形状。绝对压强包含大气压，表压则扣除了周围大气压。

压力垂直作用于浸没物体的各处表面。由于越深压强越大，下部向上的压力超过上部向下的贡献，合成的浮力等于被排开流体的重力。可以用一个想象的同形流体块替换物体来说明：这个流体块在相同表面压力和自身重力作用下本应平衡，因此表面压力的合力就是其重力的相反数。

自由漂浮且静止的物体，排开流体的重量等于自身重量；浸没体积会调整到浮力与重力平衡。均匀物体漂浮于一种液体时，浸没体积分数等于物体密度与液体密度之比，前提是比值小于一。完全浸没后，排开体积固定；若重力大于浮力，需要额外向上的力才能平衡。`,
'A uniform block of density 750 kg/m³ floats at rest in water of density 1000 kg/m³. What fraction of its volume is submerged? Enter a number from 0 to 1.','密度 750 kg/m³ 的均匀物块静止漂浮于密度 1000 kg/m³ 的水中。浸没体积占总体积的几分之几？输入 0 到 1 之间的数。',0.75,'Set ρwater g Vsubmerged equal to ρblock g Vtotal.','令 ρ水 g V浸没=ρ物块 g V总体。','The equilibrium equation gives Vsubmerged/Vtotal=750/1000=0.75. Mass and g cancel.','平衡方程给出 V浸没/V总体=750/1000=0.75，质量与 g 不影响这个比值。');

D('P03.03',`A flow rate tells us how much fluid crosses a section per unit time. If the average perpendicular speed is v across area A, volume flow rate is Av and mass flow rate is ρAv. Conservation of mass in a steady pipe without leaks requires equal mass flow rates at successive sections. For an incompressible fluid the density is unchanged, so narrowing the area increases the average speed. For a compressible fluid, density changes must also be included.

Bernoulli's relation expresses mechanical energy balance per unit volume along a streamline: p+ρv²/2+ρgh stays constant in steady, incompressible, effectively inviscid flow without a pump or turbine adding or removing energy along the segment. Pressure represents the work exchanged as neighbouring fluid pushes the parcel. The other terms represent kinetic and gravitational contributions. All three have units of pressure. In a horizontal section, a speed increase therefore corresponds to a pressure decrease under these assumptions.

Continuity and Bernoulli answer different questions and are often used together: first relate the speeds using areas, then compare pressures or heights using energy. Do not conclude that every fast-moving fluid has low pressure regardless of context. Viscosity dissipates mechanical energy, pumps supply it, and unsteady flow changes the balance. Pressure comparisons across unrelated streamlines can require additional conditions. State the model before applying the formula.`, `流量表示单位时间内穿过截面的流体有多少。若面积为 A、垂直于截面的平均速率为 v，体积流量为 Av，质量流量为 ρAv。无泄漏管道中的稳定流动必须满足质量守恒，因此不同截面的质量流量相等。不可压缩流体的密度不变，于是截面变窄时平均速率增大；可压缩流体则还必须考虑密度变化。

伯努利关系给出沿流线的单位体积机械能平衡：稳定、不可压缩、可忽略黏性的流动中，若途中没有泵或涡轮输入、取走能量，则 p+ρv²/2+ρgh 保持恒定。压强项对应相邻流体推动流体块时交换的功，另外两项对应动能与重力势能，三项都具有压强单位。在满足这些条件的水平流段中，速率增大就对应压强降低。

连续性关系与伯努利关系回答不同问题，常配合使用：先用截面积联系速率，再用能量比较压强或高度。不能脱离情境就断言所有高速流体的压强都低。黏性会耗散机械能，泵会输入能量，非稳定流动也会改变平衡。不同流线之间的比较可能需要额外条件，应先说明模型，再套用公式。`,
'Water of density 1000 kg/m³ flows steadily through an ideal horizontal pipe. Speed increases from 2 to 4 m/s. Find the pressure decrease in Pa.','密度 1000 kg/m³ 的水在理想水平管道中稳定流动，速率从 2 增至 4 m/s。压强降低多少 Pa？',6000,'With equal heights, pressure lost equals the gain in ρv²/2.','高度相同，压强的降低量等于 ρv²/2 的增加量。','p1−p2=1000×(4²−2²)/2=6000 Pa. This assumes negligible viscosity and no pump.','p1−p2=1000×(4²−2²)/2=6000 Pa，假定黏性可忽略且途中没有泵。');

D('P03.04',`Simple harmonic motion occurs when acceleration points toward an equilibrium position and is proportional to displacement from it: a=−ω²x. The minus sign makes the acceleration restoring. An ideal spring obeying Hooke's law exerts F=−kx, so a mass m attached to it has ω=√(k/m). The angular frequency ω is measured in radians per second; ordinary frequency is ω/(2π), and the period is 2π/ω. Amplitude describes how far the object travels from equilibrium, not how frequently it repeats.

A sinusoidal displacement describes the motion, with a phase specifying where in the cycle it begins. At a turning point the speed is zero but the restoring acceleration has its largest magnitude. At equilibrium the acceleration is zero while the speed is largest. Energy shifts between spring potential energy kx²/2 and kinetic energy mv²/2. With no losses, the total is kA²/2 for amplitude A, and the maximum speed is ωA.

The same model can approximate other systems near stable equilibrium. A simple pendulum at small angular amplitude has period approximately 2π√(L/g), because sinθ is approximately θ when θ is measured in radians. Large swings invalidate that approximation. Friction, nonlinear spring behaviour, or external driving can also change the motion; calling something an oscillator does not automatically make it simple harmonic.`, `简谐运动的特征是加速度总指向平衡位置，并且与离开平衡位置的位移成正比：a=−ω²x。负号表示恢复作用。理想弹簧满足胡克定律 F=−kx，所以质量为 m 的物体具有角频率 ω=√(k/m)。ω 的单位为弧度每秒，普通频率为 ω/(2π)，周期为 2π/ω。振幅描述离开平衡位置的最大距离，而不是重复频率。

位移随时间呈正弦变化，相位说明运动开始时处于周期的哪个位置。在转折点速率为零，但恢复加速度的大小最大；经过平衡位置时，加速度为零，速率却最大。能量在弹性势能 kx²/2 和动能 mv²/2 之间转化。无损耗时总能量为 kA²/2，其中 A 是振幅，最大速率为 ωA。

这个模型还能近似描述许多系统在稳定平衡位置附近的运动。小角度摆动的单摆周期约为 2π√(L/g)，因为角度以弧度计且足够小时 sinθ≈θ。大幅摆动不再满足该近似。摩擦、非线性弹簧或外界驱动也可能改变运动，因此有振荡并不自动意味着是简谐运动。`,
'An ideal spring has k=32 N/m and carries mass 0.5 kg. The oscillation amplitude is 0.1 m. Find the maximum speed in m/s.','理想弹簧 k=32 N/m，所连质量为 0.5 kg，振幅 0.1 m。最大速率是多少 m/s？',0.8,'First find ω=√(k/m), then use vmax=ωA.','先求 ω=√(k/m)，再用 v最大=ωA。','ω=√(32/0.5)=8 rad/s. Thus vmax=8×0.1=0.8 m/s.','ω=√(32/0.5)=8 rad/s，因此 v最大=8×0.1=0.8 m/s。');

D('P03.05',`Real oscillators lose mechanical energy through friction, fluid drag, electrical resistance, or other processes. In a common spring model, a damping force −bv opposes velocity. The free-motion equation is m x″+b x′+kx=0. With weak enough damping the object still oscillates, but its displacement envelope decays as exp(−bt/(2m)). The damped angular frequency is √(k/m−b²/(4m²)), lower than the undamped value. This formula only describes the underdamped regime.

At critical damping the system returns toward equilibrium without oscillating, as quickly as this linear model permits without crossing equilibrium for a simple release from rest. Stronger damping is overdamped and can produce a slower return. Initial conditions still matter. Energy associated with a vibration's amplitude is proportional to the square of that amplitude, so halving the amplitude reduces that energy scale to one quarter, not one half.

A periodic driving force supplies energy while damping removes it. After transients decay, a linear oscillator responds at the driving frequency with an amplitude and phase determined by frequency and damping. Resonance means a large response near a characteristic frequency; damping keeps the steady response finite and shifts the displacement-amplitude peak. Resonance is not unrestricted energy creation: the driver supplies the energy. Distinguish a free system's decaying natural oscillation from the continuing forced response.`, `真实振子会通过摩擦、流体阻力、电阻等过程损失机械能。常见弹簧模型用 −bv 表示与速度反向的阻尼力，自由运动方程为 m x″+b x′+kx=0。阻尼足够弱时，物体仍振荡，但位移包络按 exp(−bt/(2m)) 衰减。阻尼角频率为 √(k/m−b²/(4m²))，小于无阻尼值；这个表达式仅适用于欠阻尼。

临界阻尼时，系统不振荡地返回平衡位置；对于从静止释放的简单情形，它在该线性模型中实现不越过平衡位置的最快返回。阻尼更强为过阻尼，返回反而可能更慢。初始条件仍然重要。振动振幅对应的能量尺度与振幅平方成正比，因此振幅减半时，相应能量尺度变为四分之一，而不是一半。

周期驱动力输入能量，阻尼消耗能量。瞬态衰减后，线性振子以驱动频率响应，其振幅和相位取决于频率与阻尼。共振指特征频率附近出现较大响应；阻尼使稳态响应有限，并改变位移振幅峰值的位置。共振并不凭空创造能量，能量来自驱动源。应区分自由系统逐渐衰减的固有振动与持续的受迫响应。`,
'Compare a damped spring oscillator at two turning points, where speed is zero. Its amplitude falls to half its previous value. If its earlier mechanical energy was 80 J, find its later energy in J.','比较阻尼弹簧振子两个速率为零的转折点，后一次离开平衡位置的振幅是前一次的一半。先前机械能为 80 J，后来是多少 J？',20,'At a turning point energy is kA²/2; square the amplitude ratio.','转折点处能量为 kA²/2，将振幅比平方。','The energy ratio is (1/2)²=1/4, so the later energy is 80/4=20 J.','能量比为 (1/2)²=1/4，因此后来能量为 80/4=20 J。');

D('P03.06',`Coupled oscillators exchange forces, so the motion of one affects the other. Consider two equal masses m on a frictionless line. Each mass is attached to its own fixed support by a spring of stiffness k, and an additional spring of stiffness kc joins the masses. Measure both displacements x1 and x2 from equilibrium in the same direction. The coupling spring's extension change is x2−x1, so its forces on the two masses are equal and opposite.

Two especially simple motions are normal modes. In the symmetric mode the masses move together with x1=x2. The coupling spring does not change length, and each mass has angular frequency √(k/m). In the antisymmetric mode x1=−x2. The coupling spring stretches or compresses twice as much as either displacement, increasing the restoring force; the angular frequency is √((k+2kc)/m). Each mode has a fixed relative pattern of motion.

Because the ideal equations are linear, their solutions can be added. A general initial displacement and velocity can be decomposed into the two modes, whose phases then evolve at different frequencies. Energy can appear to pass back and forth between the masses even though the total is conserved. When modal frequencies are close, this gives a slowly varying beat pattern. The same normal-mode idea connects mechanical vibrations to molecular motion and to eigenvectors in linear algebra.`, `耦合振子彼此施加作用力，因此一个振子的运动会影响另一个。考虑在无摩擦直线上运动的两个相同质量 m：每个质量分别通过劲度系数 k 的弹簧连到固定支点，两个质量之间再用劲度系数 kc 的弹簧相连。以同一方向测量偏离平衡位置的位移 x1、x2，耦合弹簧的伸长变化为 x2−x1，对两质量的力等大反向。

两种特别简单的运动称为简正模式。对称模式中 x1=x2，两质量同向同步移动，耦合弹簧长度不变，每个质量的角频率为 √(k/m)。反对称模式中 x1=−x2，耦合弹簧的伸缩是单个质量位移的两倍，恢复作用增强，角频率为 √((k+2kc)/m)。每个模式都保持固定的相对运动图样。

由于理想运动方程是线性的，可以将解相加。一般的初始位移与速度可分解到这两个模式，它们的相位随后按不同频率变化。能量看起来会在两个质量之间往返转移，而总能量仍守恒。当模式频率接近时，会形成缓慢变化的拍现象。相同的简正模式思想还连接了机械振动、分子运动和线性代数中的特征向量。`,
'Two equal masses m=1 kg each connect to separate fixed supports with k=9 N/m springs and to each other with a kc=8 N/m spring. Find the antisymmetric mode angular frequency in rad/s.','两个相同的 1 kg 质量各通过 k=9 N/m 的弹簧连接固定支点，彼此之间再用 kc=8 N/m 弹簧相连。反对称模式的角频率是多少 rad/s？',5,'In the antisymmetric mode, the effective stiffness for each mass is k+2kc.','反对称模式中，每个质量受到的等效恢复劲度为 k+2kc。','ω=√((9+2×8)/1)=√25=5 rad/s.','ω=√((9+2×8)/1)=√25=5 rad/s。');

export function enrichPhysicsLesson(lesson){
  const detail=details.get(lesson.id);if(!detail)return lesson;
  return {...lesson,sections:lesson.sections.map((section,i)=>i===0?{type:'concept',title:B('Build the physical model','建立物理模型'),body:detail.body}:section),exercises:[...lesson.exercises,detail.exercise]};
}
