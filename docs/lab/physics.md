# 物理实验台（简易电路）

从左侧拖入**电源、开关、灯泡、电阻、导线节点**到电路板，点击元件可切换开关。  
系统根据串联关系估算电流，并提示断路 / 短路风险。

<div id="lab-phys-app" class="lab-app" markdown="0">
  <div class="lab-toolbar">
    <input id="lab-phys-title" class="lab-title-input" type="text" maxlength="40" placeholder="实验名称（可选）" value="未命名电路实验" />
    <button type="button" id="lab-phys-save" class="quiz-btn quiz-btn-next">保存进度</button>
    <button type="button" id="lab-phys-load" class="quiz-btn exam-btn-ghost">读取云端</button>
    <button type="button" id="lab-phys-clear" class="quiz-btn exam-btn-ghost">清空电路</button>
    <span id="lab-phys-msg" class="lab-msg"></span>
  </div>

  <div class="lab-layout">
    <aside class="lab-side">
      <h3>电路元件</h3>
      <div id="lab-phys-palette" class="lab-palette"></div>
      <p class="lab-side-note">提示：先放电源与开关，再放灯泡/电阻；点击开关切换通断。</p>
    </aside>

    <main class="lab-main">
      <div class="lab-bench-wrap">
        <div id="lab-phys-bench" class="lab-bench lab-bench-phys" data-drop="bench">
          <p class="lab-bench-hint">将元件拖到电路板</p>
        </div>
      </div>

      <div class="lab-ops">
        <button type="button" id="lab-phys-analyze" class="quiz-btn quiz-btn-answer">分析电路</button>
        <button type="button" id="lab-phys-remove" class="quiz-btn exam-btn-ghost">删除选中</button>
      </div>

      <section class="lab-log">
        <h3>测量与结论</h3>
        <div id="lab-phys-result" class="lab-eq">放置元件后点击「分析电路」</div>
        <ul id="lab-phys-log" class="lab-log-list"></ul>
      </section>
    </main>
  </div>
</div>
