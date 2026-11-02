(function (root) {
  'use strict';

  var code = [
    'int partition(vector<int>& v, int low, int high) {',
    '  int pivot = v[high];',
    '  int i = low - 1;',
    '  for (int j = low; j < high; j++) {',
    '    if (v[j] < pivot) {',
    '      i++;',
    '      swap(v[i], v[j]);',
    '    }',
    '  }',
    '  swap(v[i + 1], v[high]);',
    '  return i + 1;',
    '}',
    '',
    'void quickSort(vector<int>& v, int low, int high) {',
    '  if (low >= high) return;',
    '  int p = partition(v, low, high);',
    '  quickSort(v, low, p - 1);',
    '  quickSort(v, p + 1, high);',
    '}'
  ];

  function gen(input) {
    var a = input.slice(), n = a.length, steps = [];
    var fin = []; for (var q = 0; q < n; q++) fin.push(false);
    var stack = [], P = null;

    function snap(line, note, ex) {
      steps.push(Object.assign({
        line: line, note: note, arr: a.slice(), fin: fin.slice(),
        stack: stack.map(function (f) { return Object.assign({}, f); }),
        P: P ? Object.assign({}, P) : null, hl: [], sw: []
      }, ex || {}));
    }
    function swp(x, y) { var t = a[x]; a[x] = a[y]; a[y] = t; }

    function partition(low, high) {
      P = { low: low, high: high, pivot: null, i: null, j: null, pp: high };
      snap(1, 'Gọi partition(v, low=' + low + ', high=' + high + '): chia đoạn v[' + low + '..' + high + '] thành nhóm nhỏ hơn pivot | pivot | nhóm lớn hơn.');
      P.pivot = a[high];
      snap(2, 'pivot = v[high] = v[' + high + '] = ' + P.pivot + ': chọn phần tử cuối làm mốc.');
      var i = low - 1;
      P.i = i;
      snap(3, 'i = low - 1 = ' + i + ': i là ranh giới cuối của nhóm "nhỏ hơn pivot". Hiện nhóm này còn rỗng.');
      for (var j = low; ; j++) {
        P.j = j;
        if (j >= high) {
          snap(4, 'j = ' + j + ' = high: đã xét hết đoạn, thoát vòng for.');
          break;
        }
        snap(4, 'j = ' + j + ': xét v[' + j + '] = ' + a[j] + '.', { hl: [j] });
        var lt = a[j] < P.pivot;
        snap(5, 'v[j] = ' + a[j] + (lt ? ' < ' : ' >= ') + 'pivot = ' + P.pivot + (lt ? ': thuộc nhóm nhỏ, phải đưa vào nhóm nhỏ.' : ': thuộc nhóm lớn, để yên (nhóm lớn tự dài ra).'), { hl: [j] });
        if (lt) {
          i++; P.i = i;
          snap(6, 'i++ → i = ' + i + ': mở rộng nhóm nhỏ thêm một ô.');
          var same = i === j;
          swp(i, j);
          snap(7, 'swap(v[' + i + '], v[' + j + ']): ' + (same ? 'i trùng j nên tự đổi với chính nó, không thay đổi gì.' : 'đưa phần tử nhỏ vào nhóm nhỏ, đẩy phần tử lớn ra sau.'), { sw: [i, j] });
        }
      }
      swp(i + 1, high);
      P.pp = i + 1;
      fin[i + 1] = true;
      snap(10, 'swap(v[' + (i + 1) + '], v[' + high + ']): đưa pivot ' + P.pivot + ' vào giữa hai nhóm. Pivot đã ở đúng vị trí cuối cùng (màu xanh).', { sw: [i + 1, high] });
      snap(11, 'return i + 1 = ' + (i + 1) + '.');
      P = null;
      return i + 1;
    }

    function qs(low, high) {
      var f = { low: low, high: high, p: null };
      stack.push(f);
      snap(14, 'Gọi quickSort(v, ' + low + ', ' + high + ').');
      if (low >= high) {
        if (low === high) fin[low] = true;
        snap(15, 'low >= high: ' + (low === high ? 'đoạn chỉ có 1 phần tử (' + a[low] + '), tự nó đã đúng chỗ.' : 'đoạn rỗng.') + ' return.');
        stack.pop();
        return;
      }
      snap(15, 'low < high: đoạn có ' + (high - low + 1) + ' phần tử, cần xử lý tiếp.');
      snap(16, 'Gọi partition(v, ' + low + ', ' + high + ').');
      var p = partition(low, high);
      f.p = p;
      snap(16, 'p = ' + p + ': v[' + p + '] = ' + a[p] + ' đã đúng vị trí cuối cùng. Còn lại hai đoạn: trái v[' + low + '..' + (p - 1) + '] và phải v[' + (p + 1) + '..' + high + '].');
      snap(17, 'Sắp xếp đoạn bên trái: quickSort(v, ' + low + ', ' + (p - 1) + ').');
      qs(low, p - 1);
      snap(18, 'Trái xong. Sắp xếp đoạn bên phải: quickSort(v, ' + (p + 1) + ', ' + high + ').');
      qs(p + 1, high);
      snap(19, 'quickSort(v, ' + low + ', ' + high + ') xong, quay lại nơi gọi.');
      stack.pop();
    }

    qs(0, n - 1);
    snap(19, 'Hoàn tất: mọi phần tử đều đã ở đúng vị trí cuối cùng. Mảng: [' + a.join(', ') + '].');
    return steps;
  }

  function render(s) {
    var top = s.stack.length ? s.stack[s.stack.length - 1] : null;
    var P = s.P;
    function inRange(i) { return !top || (i >= top.low && i <= top.high); }
    function cls(i) {
      if (s.sw.indexOf(i) >= 0) return 'swap';
      if (P && i === P.pp && P.pivot != null && !s.fin[i]) return 'piv';
      if (s.fin[i]) return 'sorted';
      if (s.hl.indexOf(i) >= 0) return 'cmp';
      if (!inRange(i)) return 'dim';
      if (P && P.i != null && i >= P.low && i <= P.i) return 'lt';
      if (P && P.j != null && i > P.i && i < P.j && i < P.high) return 'ge';
      return '';
    }
    function mk(i) {
      var m = [];
      if (top && top.low === i) m.push('low');
      if (top && top.high === i) m.push('high');
      if (P && P.i === i && P.i >= P.low) m.push('i');
      if (P && P.j === i) m.push('j');
      return m.join(' ');
    }
    var st = '<div class="stack"><div class="rowlabel">Ngăn xếp lời gọi (dưới cùng là hàm gọi đầu tiên)</div>';
    if (!s.stack.length) st += '<div class="fr">(trống)</div>';
    for (var k = 0; k < s.stack.length; k++) {
      var f = s.stack[k];
      st += '<div class="fr' + (k === s.stack.length - 1 ? ' top' : '') + '" style="margin-left:' + (k * 14) + 'px">quickSort(' + f.low + ', ' + f.high + ')' +
        (f.p != null ? '  p = ' + f.p : '') + '</div>';
    }
    st += '</div>';
    return root.Viz.cells(s.arr, { cls: cls, mk: mk }) + st;
  }

  function vars(s) {
    var g = [], top = s.stack.length ? s.stack[s.stack.length - 1] : null;
    if (top) {
      var q = [['low', top.low], ['high', top.high]];
      if (top.p != null) q.push(['p', top.p]);
      g.push({ label: 'quickSort', items: q });
    }
    if (s.P) {
      var it = [];
      if (s.P.pivot != null) it.push(['pivot', s.P.pivot]);
      if (s.P.i != null) it.push(['i', s.P.i]);
      if (s.P.j != null) it.push(['j', s.P.j]);
      g.push({ label: 'partition', items: it });
    }
    if (!g.length) g.push({ label: 'quickSort', items: [['stack', 'rỗng']] });
    return g;
  }

  var api = {
    title: 'Quick Sort',
    idea: 'Chọn một pivot, chia mảng thành nhóm nhỏ hơn và nhóm lớn hơn pivot, đặt pivot vào đúng chỗ cuối cùng, rồi làm tương tự cho hai nhóm.',
    badges: [['Thời gian', 'O(n log n) trung bình, O(n²) xấu nhất'], ['Bộ nhớ', 'O(log n) ngăn xếp'], ['Ổn định', 'Không']],
    legend: [['piv', 'pivot'], ['lt', 'nhóm nhỏ hơn pivot'], ['ge', 'nhóm lớn hơn pivot'], ['cmp', 'đang xét'], ['swap', 'vừa đổi chỗ'], ['sorted', 'đúng chỗ cuối cùng']],
    defaultArr: [5, 2, 8, 1, 9, 3, 7, 4],
    code: code, gen: gen, render: render, vars: vars
  };
  if (typeof module !== 'undefined') module.exports = api; else root.ALGO = api;
})(typeof window !== 'undefined' ? window : globalThis);
