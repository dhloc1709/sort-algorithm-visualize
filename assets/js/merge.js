(function (root) {
  'use strict';

  var code = [
    'vector<int> mergeSort(vector<int> v) {',
    '  if (v.size() <= 1) return v;',
    '  int mid = v.size() / 2;',
    '  vector<int> A = mergeSort(vector<int>(v.begin(), v.begin() + mid));',
    '  vector<int> B = mergeSort(vector<int>(v.begin() + mid, v.end()));',
    '  vector<int> result;',
    '  int i = 0, j = 0;',
    '  while (i < A.size() && j < B.size()) {',
    '    if (A[i] <= B[j]) result.push_back(A[i++]);',
    '    else result.push_back(B[j++]);',
    '  }',
    '  while (i < A.size()) result.push_back(A[i++]);',
    '  while (j < B.size()) result.push_back(B[j++]);',
    '  return result;',
    '}'
  ];

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function gen(input) {
    var n = input.length, steps = [];
    var pieces = [{ s: 0, e: n - 1, vals: input.slice(), sorted: false }];
    var stack = [];

    function snap(line, note, ex) {
      steps.push(Object.assign({
        line: line, note: note, pieces: clone(pieces), stack: clone(stack),
        cmp: null, put: null
      }, ex || {}));
    }
    function find(s, e) {
      for (var k = 0; k < pieces.length; k++) if (pieces[k].s === s && pieces[k].e === e) return k;
      return -1;
    }
    function split(s, e, mid) {
      var k = find(s, e), p = pieces[k];
      pieces.splice(k, 1,
        { s: s, e: s + mid - 1, vals: p.vals.slice(0, mid), sorted: false },
        { s: s + mid, e: e, vals: p.vals.slice(mid), sorted: false });
    }
    function merged(s, e, vals) {
      pieces = pieces.filter(function (p) { return !(p.s >= s && p.e <= e); });
      pieces.push({ s: s, e: e, vals: vals.slice(), sorted: true });
      pieces.sort(function (x, y) { return x.s - y.s; });
    }

    function ms(s, e, vals) {
      var f = { s: s, e: e, vals: vals.slice(), mid: null, A: null, B: null, i: null, j: null, res: null };
      stack.push(f);
      snap(1, 'Gọi mergeSort([' + vals.join(', ') + ']).');
      if (vals.length <= 1) {
        pieces[find(s, e)].sorted = true;
        snap(2, 'size = ' + vals.length + ' <= 1: một phần tử luôn đã sắp xếp, trả về luôn.');
        stack.pop();
        return vals.slice();
      }
      snap(2, 'size = ' + vals.length + ' > 1: chưa dừng, phải chia đôi.');
      var mid = vals.length >> 1;
      f.mid = mid;
      split(s, e, mid);
      snap(3, 'mid = ' + vals.length + ' / 2 = ' + mid + ': nửa trái [' + vals.slice(0, mid).join(', ') + '], nửa phải [' + vals.slice(mid).join(', ') + '].');
      snap(4, 'Gọi mergeSort cho nửa trái [' + vals.slice(0, mid).join(', ') + '].');
      var A = ms(s, s + mid - 1, vals.slice(0, mid));
      f.A = A.slice();
      snap(4, 'Nửa trái đã sắp xếp xong: A = [' + A.join(', ') + '].');
      snap(5, 'Gọi mergeSort cho nửa phải [' + vals.slice(mid).join(', ') + '].');
      var B = ms(s + mid, e, vals.slice(mid));
      f.B = B.slice();
      snap(5, 'Nửa phải đã sắp xếp xong: B = [' + B.join(', ') + '].');
      f.res = [];
      snap(6, 'result = [] (mảng rỗng để gộp A và B vào).');
      f.i = 0; f.j = 0;
      snap(7, 'i = 0, j = 0: hai con trỏ, mỗi con trỏ chỉ vào phần tử nhỏ nhất còn lại của A và của B.');

      while (true) {
        var cond = f.i < A.length && f.j < B.length;
        snap(8, cond
          ? 'i = ' + f.i + ' < ' + A.length + ' và j = ' + f.j + ' < ' + B.length + ': cả hai bên còn phần tử, tiếp tục so sánh.'
          : (f.i >= A.length ? 'i = ' + f.i + ' = A.size(): A đã hết.' : 'j = ' + f.j + ' = B.size(): B đã hết.') + ' Thoát vòng lặp so sánh.',
        { cmp: cond ? { a: f.i, b: f.j } : null });
        if (!cond) break;
        var ai = f.i, bj = f.j;
        if (A[ai] <= B[bj]) {
          f.res.push(A[ai]); f.i++;
          snap(9, 'A[' + ai + '] = ' + A[ai] + ' <= B[' + bj + '] = ' + B[bj] + ': lấy ' + A[ai] + ' từ A bỏ vào result, i++.', { cmp: { a: ai, b: bj }, put: f.res.length - 1 });
        } else {
          f.res.push(B[bj]); f.j++;
          snap(10, 'A[' + ai + '] = ' + A[ai] + ' > B[' + bj + '] = ' + B[bj] + ': lấy ' + B[bj] + ' từ B bỏ vào result, j++.', { cmp: { a: ai, b: bj }, put: f.res.length - 1 });
        }
      }

      if (f.i >= A.length) {
        snap(12, 'i = ' + f.i + ' = A.size(): A không còn phần tử nào để chép.');
      } else {
        while (f.i < A.length) {
          f.res.push(A[f.i]); f.i++;
          snap(12, 'B đã hết, A còn thừa: chép nốt ' + A[f.i - 1] + ' vào result.', { put: f.res.length - 1 });
        }
      }
      if (f.j >= B.length) {
        snap(13, 'j = ' + f.j + ' = B.size(): B không còn phần tử nào để chép.');
      } else {
        while (f.j < B.length) {
          f.res.push(B[f.j]); f.j++;
          snap(13, 'A đã hết, B còn thừa: chép nốt ' + B[f.j - 1] + ' vào result.', { put: f.res.length - 1 });
        }
      }
      merged(s, e, f.res);
      snap(14, 'return result = [' + f.res.join(', ') + ']: đoạn này đã sắp xếp xong.');
      var out = f.res.slice();
      stack.pop();
      return out;
    }

    ms(0, n - 1, input.slice());
    snap(14, 'Xong! Mảng đã sắp xếp tăng dần: [' + pieces[0].vals.join(', ') + '].');
    return steps;
  }

  function render(s) {
    var top = s.stack.length ? s.stack[s.stack.length - 1] : null;
    var h = '<div class="rowlabel">Mảng gốc, chia thành các đoạn (đường nét liền = đoạn đang xử lý, xanh = đã sắp xếp)</div><div class="pieces">';
    s.pieces.forEach(function (p) {
      var inr = top && p.s >= top.s && p.e <= top.e;
      h += '<div class="piece' + (inr ? ' inrange' : '') + '">' +
        root.Viz.cells(p.vals, {
          cls: function () { return p.sorted ? 'sorted' : ''; },
          idx: function (i) { return p.s + i; }
        }) + '</div>';
    });
    h += '</div>';

    if (top && top.A) {
      var cA = s.cmp && s.cmp.a, cB = s.cmp && s.cmp.b;
      h += '<div class="rowlabel">Đang gộp trong <b>mergeSort([' + top.vals.join(', ') + '])</b></div>';
      h += '<div class="rowlabel">A</div>' + root.Viz.cells(top.A, {
        cls: function (i) { return i === cA ? 'cmp' : (i < top.i ? 'sorted' : ''); },
        mk: function (i) { return top.i === i ? 'i' : ''; }
      });
      if (top.B) {
        h += '<div class="rowlabel">B</div>' + root.Viz.cells(top.B, {
          cls: function (i) { return i === cB ? 'cmp' : (i < top.j ? 'sorted' : ''); },
          mk: function (i) { return top.j === i ? 'j' : ''; }
        });
      }
      if (top.res) {
        h += '<div class="rowlabel">result</div>' + (top.res.length
          ? root.Viz.cells(top.res, { cls: function (i) { return i === s.put ? 'swap' : ''; } })
          : '<div class="rowlabel">(rỗng)</div>');
      }
    }

    h += '<div class="stack"><div class="rowlabel">Ngăn xếp lời gọi (dưới cùng là hàm gọi đầu tiên)</div>';
    if (!s.stack.length) h += '<div class="fr">(trống)</div>';
    for (var k = 0; k < s.stack.length; k++) {
      h += '<div class="fr' + (k === s.stack.length - 1 ? ' top' : '') + '" style="margin-left:' + (k * 14) + 'px">mergeSort([' + s.stack[k].vals.join(', ') + '])</div>';
    }
    return h + '</div>';
  }

  function vars(s) {
    var top = s.stack.length ? s.stack[s.stack.length - 1] : null;
    if (!top) return [{ label: 'mergeSort', items: [['stack', 'rỗng']] }];
    var it = [['size', top.vals.length]];
    if (top.mid != null) it.push(['mid', top.mid]);
    if (top.i != null) it.push(['i', top.i]);
    if (top.j != null) it.push(['j', top.j]);
    return [{ label: 'mergeSort', items: it }];
  }

  var api = {
    title: 'Merge Sort',
    idea: 'Chia đôi mảng cho tới khi mỗi đoạn chỉ còn 1 phần tử (đã sắp xếp), rồi gộp từng cặp đoạn đã sắp xếp bằng hai con trỏ.',
    badges: [['Thời gian', 'O(n log n) mọi trường hợp'], ['Bộ nhớ', 'O(n)'], ['Ổn định', 'Có']],
    legend: [['sorted', 'đã sắp xếp'], ['cmp', 'đang so sánh'], ['swap', 'vừa bỏ vào result'], ['cur', 'đoạn đang xử lý']],
    defaultArr: [5, 2, 8, 1, 9, 3, 7, 4],
    code: code, gen: gen, render: render, vars: vars
  };
  if (typeof module !== 'undefined') module.exports = api; else root.ALGO = api;
})(typeof window !== 'undefined' ? window : globalThis);
