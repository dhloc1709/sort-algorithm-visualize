(function (root) {
  'use strict';

  var code = [
    'void heapify(vector<int>& v, int n, int i) {',
    '  while (true) {',
    '    int largest = i;',
    '    int l = 2 * i + 1;',
    '    int r = 2 * i + 2;',
    '    if (l < n && v[l] > v[largest]) largest = l;',
    '    if (r < n && v[r] > v[largest]) largest = r;',
    '    if (largest == i) break;',
    '    swap(v[i], v[largest]);',
    '    i = largest;',
    '  }',
    '}',
    '',
    'void heapSort(vector<int>& v) {',
    '  int n = v.size();',
    '  for (int i = n / 2 - 1; i >= 0; i--) {',
    '    heapify(v, n, i);',
    '  }',
    '  for (int end = n - 1; end > 0; end--) {',
    '    swap(v[0], v[end]);',
    '    heapify(v, end, 0);',
    '  }',
    '}'
  ];

  function gen(input) {
    var a = input.slice(), n = a.length, hs = n, steps = [];
    var S = { n: null, i: null, end: null }, H = null;

    function snap(line, note, ex) {
      steps.push(Object.assign({
        line: line, note: note, arr: a.slice(), hs: hs,
        S: Object.assign({}, S), H: H ? Object.assign({}, H) : null,
        hl: [], sw: [], cur: null
      }, ex || {}));
    }

    function heapify(nn, i0) {
      H = { n: nn, i: i0, largest: null, l: null, r: null };
      snap(1, 'Gọi heapify(v, n=' + nn + ', i=' + i0 + '): đẩy v[' + i0 + '] = ' + a[i0] + ' xuống đúng chỗ trong heap có ' + nn + ' phần tử.', { cur: i0 });
      while (true) {
        snap(2, 'Vòng lặp: kiểm tra node i=' + H.i + ' (giá trị ' + a[H.i] + ') có nhỏ hơn con nào không.', { cur: H.i });
        H.largest = H.i;
        snap(3, 'largest = i = ' + H.i + ': tạm coi cha là lớn nhất (giá trị ' + a[H.i] + ').', { cur: H.i, hl: [H.i] });
        H.l = 2 * H.i + 1;
        snap(4, 'l = 2*' + H.i + '+1 = ' + H.l + ': chỉ số con trái.', { cur: H.i });
        H.r = 2 * H.i + 2;
        snap(5, 'r = 2*' + H.i + '+2 = ' + H.r + ': chỉ số con phải.', { cur: H.i });

        if (H.l < nn) {
          var prevL = H.largest, gtL = a[H.l] > a[prevL];
          if (gtL) H.largest = H.l;
          snap(6, 'l=' + H.l + ' < n nên có con trái. So v[l]=' + a[H.l] + ' với v[largest]=' + a[prevL] + ': ' +
            (gtL ? 'lớn hơn, nên largest = l = ' + H.l + '.' : 'không lớn hơn, giữ nguyên largest.'), { cur: H.i, hl: [H.l, prevL] });
        } else {
          snap(6, 'l=' + H.l + ' >= n=' + nn + ': không có con trái, bỏ qua.', { cur: H.i });
        }

        if (H.r < nn) {
          var prevR = H.largest, gtR = a[H.r] > a[prevR];
          if (gtR) H.largest = H.r;
          snap(7, 'r=' + H.r + ' < n nên có con phải. So v[r]=' + a[H.r] + ' với v[largest]=' + a[prevR] + ': ' +
            (gtR ? 'lớn hơn, nên largest = r = ' + H.r + '.' : 'không lớn hơn, giữ nguyên largest.'), { cur: H.i, hl: [H.r, prevR] });
        } else {
          snap(7, 'r=' + H.r + ' >= n=' + nn + ': không có con phải, bỏ qua.', { cur: H.i });
        }

        if (H.largest === H.i) {
          snap(8, 'largest == i: cha đã lớn nhất trong 3 node, nhánh này đúng chuẩn heap rồi. break.', { cur: H.i });
          break;
        }
        snap(8, 'largest = ' + H.largest + ' khác i = ' + H.i + ': con lớn hơn cha, phải đổi chỗ.', { cur: H.i, hl: [H.i, H.largest] });

        var t = a[H.i]; a[H.i] = a[H.largest]; a[H.largest] = t;
        snap(9, 'swap(v[' + H.i + '], v[' + H.largest + ']): đổi chỗ, giá trị lớn đi lên, giá trị nhỏ đi xuống.', { cur: H.i, sw: [H.i, H.largest] });

        H.i = H.largest;
        snap(10, 'i = largest = ' + H.i + ': đi xuống node con vừa nhận giá trị nhỏ, kiểm tra tiếp.', { cur: H.i });
      }
      H = null;
    }

    snap(14, 'Gọi heapSort(v) với mảng [' + a.join(', ') + '].');
    S.n = n;
    snap(15, 'n = v.size() = ' + n + '.');

    // Giai đoạn 1: dựng max-heap
    var i = Math.floor(n / 2) - 1;
    while (true) {
      S.i = i;
      if (i < 0) {
        snap(16, 'i = ' + i + ' < 0: thoát vòng lặp. Mảng đã là max-heap, phần tử lớn nhất nằm ở v[0] = ' + a[0] + '.');
        break;
      }
      snap(16, 'Giai đoạn 1 (dựng heap): i = ' + i + ' (từ n/2-1 trở về 0, vì các node sau đó là lá, không có con).', { cur: i });
      snap(17, 'Gọi heapify(v, n, i=' + i + ').', { cur: i });
      heapify(n, i);
      i--;
    }

    // Giai đoạn 2: lấy max ra cuối mảng
    S.i = null;
    var end = n - 1;
    while (true) {
      S.end = end;
      if (end <= 0) {
        snap(19, 'end = ' + end + ': không còn gì để lấy, thoát vòng lặp.');
        break;
      }
      snap(19, 'Giai đoạn 2 (lấy max): end = ' + end + '. Vùng heap là v[0..' + end + '].');
      var tmp = a[0]; a[0] = a[end]; a[end] = tmp;
      hs = end;
      snap(20, 'swap(v[0], v[' + end + ']): đưa max (' + a[end] + ') về cuối, nó đã đúng chỗ (màu xanh). Heap giờ chỉ còn ' + hs + ' phần tử, gốc đang sai.', { sw: [0, end], cur: 0 });
      snap(21, 'Gọi heapify(v, n=end=' + end + ', i=0) để sửa lại heap.', { cur: 0 });
      heapify(end, 0);
      end--;
    }
    hs = 0;
    snap(23, 'Xong! Mảng đã sắp xếp tăng dần: [' + a.join(', ') + '].');
    return steps;
  }

  function cls(s, i) {
    if (s.sw.indexOf(i) >= 0) return 'swap';
    if (s.hl.indexOf(i) >= 0) return 'cmp';
    if (i >= s.hs) return 'sorted';
    if (s.cur === i) return 'cur';
    return '';
  }

  function tree(s) {
    var n = s.arr.length, W = 560, levels = Math.floor(Math.log(n) / Math.LN2 + 1e-9) + 1, H = levels * 64 + 16;
    function pos(i) {
      var L = Math.floor(Math.log(i + 1) / Math.LN2 + 1e-9), p = i + 1 - (1 << L);
      return [(p + 0.5) / (1 << L) * W, 34 + L * 64];
    }
    var e = '', nd = '', i;
    for (i = 1; i < n; i++) {
      var a = pos((i - 1) >> 1), b = pos(i);
      e += '<line class="edge' + (i >= s.hs ? ' dim' : '') + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
    }
    for (i = 0; i < n; i++) {
      var p = pos(i);
      nd += '<g><circle class="node ' + cls(s, i) + '" cx="' + p[0] + '" cy="' + p[1] + '" r="20"/>' +
        '<text class="nt" x="' + p[0] + '" y="' + p[1] + '">' + s.arr[i] + '</text>' +
        '<text class="ni" x="' + (p[0] + 22) + '" y="' + (p[1] - 14) + '">' + i + '</text></g>';
    }
    return '<svg class="tree" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cây heap">' + e + nd + '</svg>';
  }

  function render(s) {
    var marks = {};
    function add(idx, label) { if (idx != null && idx < s.arr.length) (marks[idx] = marks[idx] || []).push(label); }
    if (s.H) { add(s.H.i, 'i'); add(s.H.l, 'l'); add(s.H.r, 'r'); }
    return tree(s) +
      '<div class="rowlabel">Cùng mảng đó, nhìn dạng <b>mảng</b> (cha ở i, con ở 2i+1 và 2i+2):</div>' +
      root.Viz.cells(s.arr, {
        cls: function (i) { return cls(s, i); },
        mk: function (i) { return marks[i] ? marks[i].join(',') : ''; }
      });
  }

  function vars(s) {
    var g = [];
    var si = [['heap size', s.hs]];
    if (s.S.n != null) si.unshift(['n', s.S.n]);
    if (s.S.i != null) si.push(['i', s.S.i]);
    if (s.S.end != null) si.push(['end', s.S.end]);
    g.push({ label: 'heapSort', items: si });
    if (s.H) {
      var hi = [['n', s.H.n], ['i', s.H.i]];
      if (s.H.largest != null) hi.push(['largest', s.H.largest]);
      if (s.H.l != null) hi.push(['l', s.H.l]);
      if (s.H.r != null) hi.push(['r', s.H.r]);
      g.push({ label: 'heapify', items: hi });
    }
    return g;
  }

  var api = {
    title: 'Heap Sort',
    idea: 'Dựng max-heap trong chính mảng (cha luôn lớn hơn con), rồi lần lượt đổi gốc (số lớn nhất) xuống cuối và sửa lại heap cho phần còn lại.',
    badges: [['Thời gian', 'O(n log n) mọi trường hợp'], ['Bộ nhớ', 'O(1)'], ['Ổn định', 'Không']],
    legend: [['cur', 'node đang xét (i)'], ['cmp', 'đang so sánh'], ['swap', 'vừa đổi chỗ'], ['sorted', 'đã sắp xếp (ngoài heap)']],
    defaultArr: [4, 10, 3, 5, 1, 8, 7, 2],
    code: code, gen: gen, render: render, vars: vars
  };
  if (typeof module !== 'undefined') module.exports = api; else root.ALGO = api;
})(typeof window !== 'undefined' ? window : globalThis);
