import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Початково згенеровано з navigation.md оригіналу; тепер редагується вручну.
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    'popular-algorithms',
    {
      type: 'category',
      label: "Алгебра",
      items: [
        {
          type: 'category',
          label: "Основи",
          items: [
            'algebra/binary-exp',
            'algebra/euclid-algorithm',
            'algebra/extended-euclid-algorithm',
            'algebra/linear-diophantine-equation',
            'algebra/fibonacci-numbers',
          ],
        },
        {
          type: 'category',
          label: "Прості числа",
          items: [
            'algebra/sieve-of-eratosthenes',
            'algebra/prime-sieve-linear',
            'algebra/primality_tests',
            'algebra/factorization',
          ],
        },
        {
          type: 'category',
          label: "Теоретико-числові функції",
          items: [
            'algebra/phi-function',
            'algebra/divisors',
          ],
        },
        {
          type: 'category',
          label: "Модульна арифметика",
          items: [
            'algebra/module-inverse',
            'algebra/linear_congruence_equation',
            'algebra/chinese-remainder-theorem',
            'algebra/garners-algorithm',
            'algebra/factorial-modulo',
            'algebra/discrete-log',
            'algebra/primitive-root',
            'algebra/discrete-root',
            'algebra/montgomery_multiplication',
          ],
        },
        {
          type: 'category',
          label: "Системи числення",
          items: [
            'algebra/balanced-ternary',
            'algebra/gray-code',
          ],
        },
        {
          type: 'category',
          label: "Різне",
          items: [
            'algebra/bit-manipulation',
            'algebra/all-submasks',
            'algebra/big-integer',
            'algebra/fft',
            'algebra/polynomial',
            'algebra/continued-fractions',
            'algebra/factoring-exp',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Структури даних",
      items: [
        {
          type: 'category',
          label: "Основи",
          items: [
            'data_structures/stack_queue_modification',
            'data_structures/sparse-table',
          ],
        },
        {
          type: 'category',
          label: "Дерева",
          items: [
            'data_structures/disjoint_set_union',
            'data_structures/fenwick',
            'data_structures/sqrt_decomposition',
            'data_structures/segment_tree',
            'data_structures/treap',
            'data_structures/sqrt-tree',
            'data_structures/randomized_heap',
          ],
        },
        {
          type: 'category',
          label: "Просунуте",
          items: [
            'data_structures/deleting_in_log_n',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Динамічне програмування",
      items: [
        'dynamic_programming/intro-to-dp',
        'dynamic_programming/knapsack',
        'dynamic_programming/longest_increasing_subsequence',
        {
          type: 'category',
          label: "Оптимізації ДП",
          items: [
            'dynamic_programming/divide-and-conquer-dp',
            'dynamic_programming/knuth-optimization',
          ],
        },
        {
          type: 'category',
          label: "Задачі",
          items: [
            'dynamic_programming/profile-dynamics',
            'dynamic_programming/zero_matrix',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Обробка рядків",
      items: [
        {
          type: 'category',
          label: "Основи",
          items: [
            'string/string-hashing',
            'string/rabin-karp',
            'string/prefix-function',
            'string/z-function',
            'string/suffix-array',
            'string/aho_corasick',
          ],
        },
        {
          type: 'category',
          label: "Просунуте",
          items: [
            'string/suffix-tree-ukkonen',
            'string/suffix-automaton',
            'string/lyndon_factorization',
          ],
        },
        {
          type: 'category',
          label: "Задачі",
          items: [
            'string/expression_parsing',
            'string/manacher',
            'string/main_lorentz',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Лінійна алгебра",
      items: [
        {
          type: 'category',
          label: "Матриці",
          items: [
            'linear_algebra/linear-system-gauss',
            'linear_algebra/determinant-gauss',
            'linear_algebra/determinant-kraut',
            'linear_algebra/rank-matrix',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Комбінаторика",
      items: [
        {
          type: 'category',
          label: "Основи",
          items: [
            'algebra/factorial-divisors',
            'combinatorics/binomial-coefficients',
            'combinatorics/catalan-numbers',
          ],
        },
        {
          type: 'category',
          label: "Техніки",
          items: [
            'combinatorics/inclusion-exclusion',
            'combinatorics/burnside',
            'combinatorics/stars_and_bars',
            'combinatorics/generating_combinations',
          ],
        },
        {
          type: 'category',
          label: "Задачі",
          items: [
            'combinatorics/bishops-on-chessboard',
            'combinatorics/bracket_sequences',
            'combinatorics/counting_labeled_graphs',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Чисельні методи",
      items: [
        {
          type: 'category',
          label: "Пошук",
          items: [
            'num_methods/binary_search',
            'num_methods/ternary_search',
            'num_methods/roots_newton',
            'num_methods/simulated_annealing',
          ],
        },
        {
          type: 'category',
          label: "Інтегрування",
          items: [
            'num_methods/simpson-integration',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Геометрія",
      items: [
        {
          type: 'category',
          label: "Елементарні операції",
          items: [
            'geometry/basic-geometry',
            'geometry/segment-to-line',
            'geometry/lines-intersection',
            'geometry/check-segments-intersection',
            'geometry/segments-intersection',
            'geometry/circle-line-intersection',
            'geometry/circle-circle-intersection',
            'geometry/tangents-to-two-circles',
            'geometry/length-of-segments-union',
          ],
        },
        {
          type: 'category',
          label: "Многокутники",
          items: [
            'geometry/oriented-triangle-area',
            'geometry/area-of-simple-polygon',
            'geometry/point-in-convex-polygon',
            'geometry/minkowski',
            'geometry/picks-theorem',
            'geometry/lattice-points',
          ],
        },
        {
          type: 'category',
          label: "Опукла оболонка",
          items: [
            'geometry/convex-hull',
            'geometry/convex_hull_trick',
          ],
        },
        {
          type: 'category',
          label: "Замітальна пряма",
          items: [
            'geometry/intersecting_segments',
          ],
        },
        {
          type: 'category',
          label: "Планарні графи",
          items: [
            'geometry/planar',
            'geometry/point-location',
          ],
        },
        {
          type: 'category',
          label: "Різне",
          items: [
            'geometry/nearest_points',
            'geometry/delaunay',
            'geometry/vertical_decomposition',
            'geometry/halfplane-intersection',
            'geometry/manhattan-distance',
            'geometry/enclosing-circle',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Графи",
      items: [
        {
          type: 'category',
          label: "Обходи графа",
          items: [
            'graph/breadth-first-search',
            'graph/depth-first-search',
          ],
        },
        {
          type: 'category',
          label: "Компоненти зв'язності, мости, точки зчленування",
          items: [
            'graph/search-for-connected-components',
            'graph/bridge-searching',
            'graph/bridge-searching-online',
            'graph/cutpoints',
            'graph/strongly-connected-components',
            'graph/strong-orientation',
          ],
        },
        {
          type: 'category',
          label: "Найкоротші шляхи з однієї вершини",
          items: [
            'graph/dijkstra',
            'graph/dijkstra_sparse',
            'graph/bellman_ford',
            'graph/01_bfs',
            'graph/desopo_pape',
          ],
        },
        {
          type: 'category',
          label: "Найкоротші шляхи між усіма парами",
          items: [
            'graph/all-pair-shortest-path-floyd-warshall',
            'graph/fixed_length_paths',
          ],
        },
        {
          type: 'category',
          label: "Кістякові дерева",
          items: [
            'graph/mst_prim',
            'graph/mst_kruskal',
            'graph/mst_kruskal_with_dsu',
            'graph/second_best_mst',
            'graph/kirchhoff-theorem',
            'graph/pruefer_code',
          ],
        },
        {
          type: 'category',
          label: "Цикли",
          items: [
            'graph/finding-cycle',
            'graph/finding-negative-cycle-in-graph',
            'graph/euler_path',
          ],
        },
        {
          type: 'category',
          label: "Найнижчий спільний предок (LCA)",
          items: [
            'graph/lca',
            'graph/lca_binary_lifting',
            'graph/lca_farachcoltonbender',
            'graph/rmq_linear',
            'graph/lca_tarjan',
          ],
        },
        {
          type: 'category',
          label: "Потоки та суміжні задачі",
          items: [
            'graph/edmonds_karp',
            'graph/push-relabel',
            'graph/push-relabel-faster',
            'graph/dinic',
            'graph/mpm',
            'graph/flow_with_demands',
            'graph/min_cost_flow',
            'graph/Assignment-problem-min-flow',
          ],
        },
        {
          type: 'category',
          label: "Парування та суміжні задачі",
          items: [
            'graph/bipartite-check',
            'graph/kuhn_maximum_bipartite_matching',
            'graph/hungarian-algorithm',
          ],
        },
        {
          type: 'category',
          label: "Різне",
          items: [
            'graph/topological-sort',
            'graph/edge_vertex_connectivity',
            'graph/tree_painting',
            'graph/2SAT',
            'graph/hld',
            'graph/centroid_decomposition',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: "Різне",
      items: [
        {
          type: 'category',
          label: "Послідовності",
          items: [
            'sequences/rmq',
            'others/maximum_average_segment',
            'sequences/k-th',
            'sequences/mex',
          ],
        },
        {
          type: 'category',
          label: "Теорія ігор",
          items: [
            'game_theory/games_on_graphs',
            'game_theory/sprague-grundy-nim',
          ],
        },
        {
          type: 'category',
          label: "Розклади",
          items: [
            'schedules/schedule_one_machine',
            'schedules/schedule_two_machines',
            'schedules/schedule-with-completion-duration',
          ],
        },
        {
          type: 'category',
          label: "Різне",
          items: [
            'others/tortoise_and_hare',
            'others/josephus_problem',
            'others/15-puzzle',
            'others/stern_brocot_tree_farey_sequences',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
