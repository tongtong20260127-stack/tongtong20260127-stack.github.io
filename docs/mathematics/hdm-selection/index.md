# 05 hdm 的数学社 · 精选集

选题整理自 [hdm 的数学社](https://hdmgydkn.kimi.site/)（表述与排版略有整理）。偏重分析与竞赛思想，建议先独立思考，再展开提示与解答。

---

## 题 1　数列 \((1+1/n)^n\) 的极限

**来源标签：** 数学分析 · 极限 · 单调有界  
**原站编号：** P0001

设

$$
a_n = \left(1 + \dfrac{1}{n}\right)^n,
$$

求证：\(\{a_n\}\) 收敛，并说明其极限就是自然常数 \(e\)。

??? tip "提示"
    证明该数列**单调递增且有上界**，由单调有界原理即得收敛；其极限定义为 \(e\)。

??? success "解答（点击展开）"
    分两步：单调性与有界性。

    **1. 递增**

    由 AM–GM 不等式，

    $$
    \left(1+\dfrac{1}{n}\right)^n \cdot 1
    \le
    \left(\dfrac{n\left(1+\dfrac{1}{n}\right)+1}{n+1}\right)^{n+1}
    =
    \left(1+\dfrac{1}{n+1}\right)^{n+1},
    $$

    即 \(a_n \le a_{n+1}\)。

    **2. 有上界**

    二项式展开：

    $$
    a_n
    = \sum_{k=0}^{n} \binom{n}{k} \dfrac{1}{n^k}
    \le \sum_{k=0}^{n} \dfrac{1}{k!}
    \le 1 + 1 + \dfrac{1}{2} + \dfrac{1}{4} + \cdots
    < 3.
    $$

    由单调有界原理，\(\{a_n\}\) 收敛，其极限定义为

    $$
    e := \lim_{n\to\infty} a_n \approx 2.71828.
    $$

---

## 题 2　高斯积分

**来源标签：** 概率与统计 · 积分 · 经典  
**原站编号：** P0002

计算反常积分

$$
I = \int_{-\infty}^{+\infty} e^{-x^2}\,\mathrm{d}x.
$$

（\(e^{-x^2}\) 没有初等原函数，可考虑 \(I^2\)。）

??? tip "提示"
    不直接找原函数；把 \(I^2\) 写成平面上的二重积分，再换极坐标。

??? success "解答（点击展开）"
    考虑

    $$
    I^2
    = \left(\int_{-\infty}^{+\infty} e^{-x^2}\,\mathrm{d}x\right)
      \left(\int_{-\infty}^{+\infty} e^{-y^2}\,\mathrm{d}y\right)
    = \iint_{\mathbb{R}^2} e^{-(x^2+y^2)}\,\mathrm{d}x\,\mathrm{d}y.
    $$

    换极坐标 \(x = r\cos\theta,\; y = r\sin\theta\)，雅可比为 \(r\)：

    $$
    I^2
    = \int_0^{2\pi}\!\int_0^{+\infty} e^{-r^2}\, r\,\mathrm{d}r\,\mathrm{d}\theta
    = 2\pi \cdot \left[-\dfrac{1}{2}e^{-r^2}\right]_0^{+\infty}
    = \pi.
    $$

    因 \(I > 0\)，得

    $$
    I = \sqrt{\pi}.
    $$

    **评注：** 这正是正态分布密度

    $$
    \dfrac{1}{\sqrt{2\pi}}\, e^{-x^2/2}
    $$

    归一化常数的来源。

---

## 题 3　巴塞尔问题

**来源标签：** 数学分析 · 级数 · 欧拉  
**原站编号：** P0003  
**历史：** P. Mengoli 提出（1644）；欧拉给出闭形式（1735）

求级数

$$
\sum_{n=1}^{\infty} \dfrac{1}{n^2}
$$

的精确值。

??? tip "提示"
    利用 \(\sin x / x\) 的泰勒展开与无穷乘积表示，比较 \(x^2\) 项系数。

??? success "解答（点击展开）"
    **欧拉思路（纲要）**

    一方面，泰勒展开：

    $$
    \dfrac{\sin x}{x}
    = 1 - \dfrac{x^2}{3!} + \dfrac{x^4}{5!} - \cdots.
    $$

    另一方面，\(\sin x / x\) 的零点为 \(x = \pm\pi,\; \pm 2\pi,\; \ldots\)，可写成

    $$
    \dfrac{\sin x}{x}
    = \prod_{n=1}^{\infty}\left(1 - \dfrac{x^2}{n^2\pi^2}\right).
    $$

    展开乘积，\(x^2\) 项系数为

    $$
    -\sum_{n\ge 1}\dfrac{1}{n^2\pi^2}.
    $$

    与泰勒级数中 \(x^2\) 系数 \(-1/6\) 比较，得

    $$
    \sum_{n=1}^{\infty}\dfrac{1}{n^2\pi^2} = \dfrac{1}{6}
    \implies
    \sum_{n=1}^{\infty}\dfrac{1}{n^2} = \dfrac{\pi^2}{6}.
    $$

    **说明：** 无穷乘积展开的严格理论后由 Weierstrass 等补全；此处保留欧拉的经典启发性论证。

---

## 题 4　循环条件与整数结论

**来源标签：** 数学竞赛 · 数论 · 线性代数  
**原站编号：** P0004  
**出处：** 捷克–波兰–斯洛伐克数学竞赛风格

设整数 \(n \ge 2\)，\(a_1,a_2,\ldots,a_n\) 是非零实数，满足

$$
a_1 + \dfrac{1}{a_2},\quad
a_2 + \dfrac{1}{a_3},\quad
\ldots,\quad
a_{n-1} + \dfrac{1}{a_n},\quad
a_n + \dfrac{1}{a_1}
$$

都是整数。求证：

$$
a_1 a_2 \cdots a_n + \dfrac{1}{a_1 a_2 \cdots a_n}
$$

是整数。

（约定下标循环：\(a_{n+1} = a_1\)。）

??? tip "提示"
    尝试把条件写成矩阵作用；乘积对应特征值，迹给出 \(\lambda + 1/\lambda\)。

??? success "解答（点击展开）"
    对 \(1 \le i \le n\)，记

    $$
    M_i =
    \begin{pmatrix}
    a_i + \dfrac{1}{a_{i+1}} & -1 \\
    1 & 0
    \end{pmatrix},
    \qquad
    v_i =
    \begin{pmatrix}
    a_i \\
    1
    \end{pmatrix}.
    $$

    （下标循环。）直接计算可得

    $$
    M_i v_{i+1} = a_{i+1}\, v_i.
    $$

    于是

    $$
    M_1 M_2 \cdots M_n\, v_1
    = a_1 a_2 \cdots a_n\, v_1.
    $$

    记

    $$
    A = M_1 M_2 \cdots M_n,
    \qquad
    \lambda = a_1 a_2 \cdots a_n,
    $$

    则 \(A v_1 = \lambda v_1\)，即 \(\lambda\) 是 \(A\) 的一个特征值。

    又 \(\det M_i = 1\)，故 \(\det A = 1\)。对 \(2\times 2\) 矩阵，另一特征值必为 \(1/\lambda\)，从而

    $$
    \operatorname{tr} A = \lambda + \dfrac{1}{\lambda}.
    $$

    由题设，每个 \(M_i\) 的元素都是整数，故 \(A\) 的元素都是整数，从而 \(\operatorname{tr} A\) 是整数。  
    即

    $$
    \lambda + \dfrac{1}{\lambda}
    = a_1 a_2 \cdots a_n + \dfrac{1}{a_1 a_2 \cdots a_n}
    $$

    为整数。证毕。

---

## 题 5　神秘网格：每行每列恰两个黑格

**来源标签：** 数学竞赛 · 排列 · 生成函数  
**原站编号：** P0005

给定一个 \(n \times n\) 的网格，将其中一些格子涂黑，使得**每行、每列都恰有两个格子被涂黑**。问有多少种涂法？

??? tip "提示"
    把每行两个黑格的列号看成一对；全体行的选择可与**错排 / 置换的环结构**联系起来，再用生成函数提取系数。

??? success "解答（点击展开）"
    记答案为 \(a_n\)。一种标准结果是：

    $$
    a_n
    =
    (n!)^2
    \,[x^n]\!
    \left(
    (1-x)^{-1/2}\, e^{-x/2}
    \right).
    $$

    **思路纲要（原站 hdm）：**

    对一种合法涂色，设第 \(k\) 行涂黑的列是 \(a_k < b_k\)。以
    \(\{1,\ldots,n\}\) 为顶点、以这些无序对为边，得到一个每个顶点度数恰为 \(2\) 的简单图，从而由若干个环组成。

    对每个环定向后，对应一个**错排**（无不动点的置换）的环分解。记 \(c(\sigma)\) 为错排 \(\sigma\) 的环数，\(D_n\) 为 \(n\) 阶错排集合，则有

    $$
    a_n
    =
    n!
    \sum_{\sigma \in D_n} 2^{-c(\sigma)}.
    $$

    再利用指数生成函数与错排的环指标，可整理为上面的系数提取形式。

    **小 \(n\) 检验：**

    - \(n=2\)：只有 \(\dbinom{2}{2}^2 = 1\) 种“每行每列两个黑格”在 \(2\times 2\) 上即全黑，需按定义核对；更常见从 \(n\ge 3\) 开始用公式计数。
    - 该公式便于用计算机或级数展开得到具体数值。

---

## 说明

- 题目与核心解法思路来自 [hdm 的数学社](https://hdmgydkn.kimi.site/)，本站做了排版、符号与叙述上的整理，便于在 MkDocs 中阅读。
- 解答默认折叠，点击标题即可展开；建议先自己写一写再对照。
