// Complete source files for the code notebook; existing learner drafts remain untouched.
export const cppExamples={
  'cs.instructions':String.raw`#include <iostream>
int main() {
    int a = 0, b = 0;
    if (!(std::cin >> a >> b)) return 1;
    // A wider intermediate holds the sum of two Windows 32-bit ints.
    const long long sum = static_cast<long long>(a) + b;
    std::cout << sum << "\n";
}
`,
  'cs.variables':String.raw`#include <iostream>
int main() {
    int x = 5;
    int y = x + 1;
    x = 9;
    // Assignment changed x, but did not re-evaluate the earlier expression for y.
    std::cout << x << " " << y << "\n";
}
`,
  'cs.conditionals':String.raw`#include <iostream>
int main() {
    int x = 0;
    if (!(std::cin >> x)) return 1;
    if (x >= 3 && x <= 8) {
        std::cout << "inside\n";
    } else {
        std::cout << "outside\n";
    }
}
`,
  'cs.loops':String.raw`#include <iostream>
int main() {
    int sum = 0;
    for (int i = 1; i <= 5; ++i) {
        sum += i;
    }
    std::cout << sum << "\n";
}
`,
  'cs.functions':String.raw`#include <iostream>
// Precondition: x*x must fit in int; the example call uses x=6.
int square(int x) {
    return x * x;
}
int main() {
    std::cout << square(6) << "\n";
}
`,
  'cs.arrays':String.raw`#include <iostream>
#include <vector>
int main() {
    std::vector<int> values{8, 3, 6};
    if (values.empty()) return 1;
    int best = values[0];
    for (int value : values) {
        if (value > best) best = value;
    }
    std::cout << best << "\n";
}
`,
};
