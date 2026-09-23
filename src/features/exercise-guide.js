/**
 * ForgePath V4.0 Web — Exercise Guide
 * Replaces the retired motion viewer with lightweight technique guidance
 * and a YouTube search action. No video provider is hard-coded per exercise.
 */
(function () {
  function youtubeQueryFor(exercise) {
    return `${exercise?.name || 'exercise'} proper form tutorial`;
  }

  function openYouTubeTutorial(id) {
    const exercise = window.EXERCISES?.find?.((item) => item.id === id) || { id, name: id };
    const query = encodeURIComponent(youtubeQueryFor(exercise));
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noopener,noreferrer');
  }

  function visualDemo(exercise) {
    const muscles = (exercise?.muscle || '')
      .split('•')
      .map((item) => item.trim())
      .filter(Boolean);

    return `<div class="fp-guide-card">
      <div class="fp-guide-head">
        <b>▶ Exercise Guide • ${exercise?.name || ''}</b>
        <span>Video tutorial</span>
      </div>
      <div class="fp-guide-body">
        <div class="fp-guide-muscles">${muscles.map((muscle) => `<span>${muscle}</span>`).join('')}</div>
        <div>
          <button class="fp-youtube-btn" onclick="openYouTubeTutorial('${exercise?.id || ''}')">▶ Tìm hướng dẫn trên YouTube</button>
          <div class="fp-youtube-note">Mở kết quả tìm kiếm để bạn chọn video và ngôn ngữ phù hợp.</div>
        </div>
      </div>
    </div>`;
  }

  window.youtubeQueryFor = youtubeQueryFor;
  window.openYouTubeTutorial = openYouTubeTutorial;
  window.visualDemo = visualDemo;
})();
