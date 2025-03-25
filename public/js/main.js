document.addEventListener('DOMContentLoaded', function() {
  // Debug kiểm tra dữ liệu nguyên tố
  console.log('Elements data:', window.elements ? window.elements.length : 'not found');
  
  const currentPath = window.location.pathname;
  
  // Xử lý theo từng trang
  if (currentPath === '/') {
    initHomePage();
  } else if (currentPath === '/notebook') {
    initNotebookPage();
  } else if (currentPath === '/achievements') {
    initAchievementsPage();
  }

  // Làm nổi bật menu hiện tại
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Tải điểm số từ localStorage nếu có
  const scoreElement = document.querySelector('.score-value');
  if (scoreElement) {
    const savedScore = localStorage.getItem('chemistry_score');
    if (savedScore) {
      scoreElement.textContent = savedScore;
    }
  }
});

// Các hàm khởi tạo trang
function initHomePage() {
  loadElements();
  setupEventListeners();
}

function initNotebookPage() {
  loadNotebook();
}

function initAchievementsPage() {
  loadAchievements();
}

// Hàm xử lý cho trang chủ
function loadElements() {
  const elementsContainer = document.getElementById('elementsContainer');
  if (!elementsContainer) return;
  
  // Xử lý hiển thị các nguyên tố từ dữ liệu được render từ server
  const elements = window.elements || [];
  
  if (elements && elements.length > 0) {
    console.log('Dữ liệu nguyên tố đã được tải:', elements.length, 'nguyên tố');
    renderElements(elements);
  } else {
    console.error('Không tìm thấy dữ liệu nguyên tố');
    // Nếu không có dữ liệu, hiển thị thông báo lỗi
    elementsContainer.innerHTML = '<div class="alert alert-danger">Không thể tải dữ liệu nguyên tố</div>';
  }
}

// Thêm hàm renderElements vào sau hàm loadElements
function renderElements(elements) {
  const elementsContainer = document.getElementById('elementsContainer');
  elementsContainer.innerHTML = '';
  
  elements.forEach(element => {
    const button = document.createElement('button');
    button.className = 'element-btn';
    button.setAttribute('data-symbol', element.symbol);
    button.setAttribute('data-name', element.name);
    button.setAttribute('data-name-vi', element.name_vi);
    button.setAttribute('data-group', element.group);
    button.innerHTML = `
      <strong>${element.symbol}</strong>
      <small>${element.name_vi}</small>
    `;
    
    button.addEventListener('click', () => {
      // Thêm hiệu ứng khi click
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300);
      
      selectElement(element);
    });
    
    elementsContainer.appendChild(button);
  });
}

// Mảng lưu các nguyên tố đã chọn
const selectedElementsArray = [];

function selectElement(element) {
  if (selectedElementsArray.length >= 3) {
    alert('Bạn chỉ có thể chọn tối đa 3 nguyên tố!');
    return;
  }
  
  // Kiểm tra xem nguyên tố đã được chọn chưa
  if (selectedElementsArray.some(el => el.symbol === element.symbol)) {
    return;
  }
  
  selectedElementsArray.push(element);
  updateSelectedElementsDisplay();
}

function removeElement(symbol) {
  const index = selectedElementsArray.findIndex(el => el.symbol === symbol);
  if (index !== -1) {
    selectedElementsArray.splice(index, 1);
    updateSelectedElementsDisplay();
  }
}

function updateSelectedElementsDisplay() {
  const container = document.getElementById('selectedElements');
  
  if (selectedElementsArray.length === 0) {
    container.innerHTML = '<div class="placeholder-text">Chưa có nguyên tố</div>';
    return;
  }
  
  container.innerHTML = '';
  
  selectedElementsArray.forEach(element => {
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.innerHTML = `
      <span>${element.symbol} - ${element.name_vi}</span>
      <button type="button" class="btn-close" aria-label="Xóa" data-symbol="${element.symbol}">×</button>
    `;
    
    badge.querySelector('.btn-close').addEventListener('click', function() {
      removeElement(element.symbol);
    });
    
    container.appendChild(badge);
  });
}

function setupEventListeners() {
  const processButton = document.getElementById('processButton');
  const saveButton = document.getElementById('saveButton');
  
  if (processButton) {
    processButton.addEventListener('click', processReaction);
  }
  
  if (saveButton) {
    saveButton.addEventListener('click', saveReaction);
  }

  // Xử lý tìm kiếm nguyên tố
  const elementSearch = document.getElementById('elementSearch');
  if (elementSearch) {
    elementSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const elementButtons = document.querySelectorAll('.element-btn');
      
      elementButtons.forEach(button => {
        const symbol = button.getAttribute('data-symbol').toLowerCase();
        const nameEN = button.getAttribute('data-name').toLowerCase();
        const nameVI = button.getAttribute('data-name-vi').toLowerCase();
        
        if (symbol.includes(searchTerm) || nameEN.includes(searchTerm) || nameVI.includes(searchTerm)) {
          button.style.display = '';
        } else {
          button.style.display = 'none';
        }
      });
    });
  }
}

// Xử lý phản ứng hóa học
function processReaction() {
  if (selectedElementsArray.length === 0) {
    alert('Vui lòng chọn ít nhất một nguyên tố!');
    return;
  }
  
  // Lấy giá trị từ các nút radio được chọn
  const temperature = document.querySelector('input[name="temperature"]:checked').value;
  const pressure = document.querySelector('input[name="pressure"]:checked').value;
  const catalyst = document.querySelector('input[name="catalyst"]:checked').value;
  
  // Hiển thị trạng thái đang xử lý và lab animation
  const processButton = document.getElementById('processButton');
  const labAnimation = document.getElementById('labAnimation');
  
  processButton.disabled = true;
  processButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
  
  // Hiển thị hiệu ứng lab
  labAnimation.classList.remove('d-none');
  
  // Cuộn đến hiệu ứng lab
  labAnimation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Chuẩn bị dữ liệu để gửi đến server
  const requestData = {
    selectedElements: selectedElementsArray.map(el => el.symbol),
    temperature,
    pressure,
    catalyst
  };
  
  // Gửi yêu cầu đến server sau khi hiệu ứng đã hiển thị 1.5 giây
  setTimeout(() => {
    fetch('/api/reaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(result => {
      // Hiển thị kết quả với hiệu ứng
      setTimeout(() => {
        labAnimation.classList.add('d-none');
        displayResult(result, requestData);
        processButton.disabled = false;
        processButton.innerHTML = '🔮 Tiến hành Phản ứng';
        
        // Tạo hiệu ứng xuất hiện cho kết quả
        const resultElement = document.getElementById('result');
        resultElement.style.opacity = '0';
        resultElement.classList.remove('d-none');
        
        setTimeout(() => {
          resultElement.style.opacity = '1';
          // Cuộn đến kết quả
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
      }, 500);
    })
    .catch(error => {
      console.error('Lỗi khi gọi API:', error);
      alert('Đã xảy ra lỗi khi xử lý phản ứng. Vui lòng thử lại sau!');
      processButton.disabled = false;
      processButton.innerHTML = '🔮 Tiến hành Phản ứng';
      labAnimation.classList.add('d-none');
    });
  }, 1500);
}

// Hiển thị kết quả phản ứng
function displayResult(result, requestData) {
  const resultElement = document.getElementById('result');
  resultElement.classList.remove('d-none');
  
  // Cập nhật dữ liệu phản ứng
  document.getElementById('reactionEquation').textContent = result.reactionEquation || 'Không có phương trình';
  document.getElementById('explanation').textContent = result.explanation || 'Không có giải thích';
  document.getElementById('funFact').textContent = result.funFact || 'Không có thông tin thú vị';
  
  // Cập nhật thanh nguy hiểm
  const dangerBar = document.getElementById('dangerBar');
  dangerBar.style.width = '0%';
  
  setTimeout(() => {
    dangerBar.style.width = (result.danger * 10) + '%';
  }, 200);
  
  // Cập nhật thông báo phản ứng
  const reactionAlert = document.getElementById('reactionAlert');
  const xpElement = document.querySelector('.xp-value');
  
  if (result.isRealReaction) {
    reactionAlert.className = 'result-status success';
    reactionAlert.innerHTML = '<strong>Thành công!</strong> Bạn đã tạo ra một phản ứng có thật.';
    // Cộng XP cho phản ứng thành công
    updateScore(25);
    xpElement.textContent = '+25 XP';
    xpElement.classList.remove('negative');
  } else {
    reactionAlert.className = 'result-status info';
    reactionAlert.innerHTML = '<strong>Thú vị!</strong> Đây là một phản ứng giả tưởng.';
    // Trừ XP cho phản ứng không thành công
    updateScore(-10);
    xpElement.textContent = '-10 XP';
    xpElement.classList.add('negative');
  }
  
  // Lưu dữ liệu phản ứng hiện tại để có thể lưu vào sau này
  window.currentReaction = {
    ...result,
    elementSymbols: requestData.selectedElements,
    temperature: requestData.temperature,
    pressure: requestData.pressure,
    catalyst: requestData.catalyst
  };
}

// Cập nhật hàm updateScore để hỗ trợ điểm âm
function updateScore(points) {
  const scoreElement = document.querySelector('.score-value');
  if (scoreElement) {
    const currentScore = parseInt(scoreElement.textContent);
    
    // Animation hiển thị số điểm thay đổi
    const pointsAnimation = document.createElement('div');
    pointsAnimation.className = 'points-animation';
    
    if (points < 0) {
      pointsAnimation.classList.add('negative');
    }
    
    pointsAnimation.textContent = points > 0 ? `+${points}` : points;
    document.querySelector('.score-display').appendChild(pointsAnimation);
    
    setTimeout(() => {
      const newScore = Math.max(0, currentScore + points); // Không cho phép điểm âm
      scoreElement.textContent = newScore;
      
      // Lưu điểm số vào localStorage
      localStorage.setItem('chemistry_score', newScore);
      
      pointsAnimation.remove();
    }, 1000);
  }
}

// Lưu phản ứng vào localStorage
function saveReaction() {
  if (!window.currentReaction) {
    alert('Không có phản ứng nào để lưu!');
    return;
  }
  
  const userNote = document.getElementById('userNote').value;
  const reaction = {
    ...window.currentReaction,
    userNote
  };
  
  // Sử dụng StorageManager để lưu phản ứng
  StorageManager.saveReaction(reaction);
  
  // Thông báo thành công
  alert('Đã lưu phản ứng vào Sổ tay Hóa học!');
}

// Lưu và quản lý thành tích
function addAchievement(id, title, description) {
  let achievements = JSON.parse(localStorage.getItem('chemistry_achievements') || '[]');
  
  // Kiểm tra xem thành tích đã tồn tại chưa
  if (!achievements.some(a => a.id === id)) {
    achievements.push({
      id,
      title,
      description,
      unlockedAt: new Date().toISOString()
    });
    
    localStorage.setItem('chemistry_achievements', JSON.stringify(achievements));
    
    // Thêm điểm thưởng cho thành tích mới
    updateScore(50);
    
    // Hiển thị thông báo thành tích
    const achievementNotification = document.createElement('div');
    achievementNotification.className = 'achievement-notification';
    achievementNotification.innerHTML = `
      <div class="achievement-icon"><i class="fas fa-trophy"></i></div>
      <div class="achievement-info">
        <div class="achievement-title">${title}</div>
        <div class="achievement-desc">${description}</div>
      </div>
    `;
    
    document.body.appendChild(achievementNotification);
    
    setTimeout(() => {
      achievementNotification.classList.add('show');
      
      setTimeout(() => {
        achievementNotification.classList.remove('show');
        setTimeout(() => {
          achievementNotification.remove();
        }, 500);
      }, 3000);
    }, 100);
  }
}

// Tải và hiển thị danh sách phản ứng đã lưu
function loadNotebook() {
  const reactions = StorageManager.getReactions();
  const notebookEntries = document.getElementById('notebookEntries');
  const emptyNotebook = document.getElementById('emptyNotebook');
  
  if (reactions.length === 0) {
    notebookEntries.classList.add('d-none');
    emptyNotebook.classList.remove('d-none');
    return;
  }
  
  notebookEntries.classList.remove('d-none');
  emptyNotebook.classList.add('d-none');
  notebookEntries.innerHTML = '';
  
  reactions.forEach(reaction => {
    const card = document.createElement('div');
    card.className = 'card mb-3';
    
    const colorClass = reaction.isRealReaction ? 'border-success' : 'border-info';
    card.classList.add(colorClass);
    
    const date = new Date(reaction.savedAt);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    card.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">${reaction.elementSymbols.join(' + ')}</h5>
        <button class="btn btn-sm btn-outline-danger delete-reaction" data-id="${reaction.id}">Xóa</button>
      </div>
      <div class="card-body">
        <p><strong>Phương trình:</strong> ${reaction.reactionEquation}</p>
        <p><strong>Điều kiện:</strong> Nhiệt độ: ${reaction.temperature}, Áp suất: ${reaction.pressure}, Xúc tác: ${reaction.catalyst || 'Không có'}</p>
        <p><strong>Giải thích:</strong> ${reaction.explanation}</p>
        
        ${reaction.userNote ? `<div class="alert alert-secondary mt-2">
          <strong>Ghi chú:</strong> ${reaction.userNote}
        </div>` : ''}
        
        <small class="text-muted">Đã lưu vào: ${formattedDate}</small>
      </div>
    `;
    
    notebookEntries.appendChild(card);
  });
  
  // Thêm sự kiện xóa
  document.querySelectorAll('.delete-reaction').forEach(button => {
    button.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      if (confirm('Bạn có chắc muốn xóa phản ứng này không?')) {
        StorageManager.deleteReaction(id);
        loadNotebook(); // Tải lại danh sách
      }
    });
  });
}

// Tải và hiển thị thành tích
function loadAchievements() {
  const achievements = StorageManager.getAchievements();
  
  // Cập nhật thanh tiến độ
  updateProgress('alchemist', achievements.realReactions || 0, 10);
  updateProgress('madscientist', achievements.funnyReactions || 0, 5);
  updateProgress('explosion', achievements.explosiveReactions || 0, 3);
  
  // Hiển thị tính năng đã mở khóa
  const unlockedFeatures = document.getElementById('unlockedFeatures');
  const noUnlockedFeatures = document.getElementById('noUnlockedFeatures');
  
  if (!achievements.unlockedFeatures || achievements.unlockedFeatures.length === 0) {
    noUnlockedFeatures.style.display = 'block';
    return;
  }
  
  noUnlockedFeatures.style.display = 'none';
  unlockedFeatures.innerHTML = '';
  
  const featureNames = {
    'advancedMode': 'Chế độ thử nghiệm nâng cao - Thêm nhiều điều kiện ảnh hưởng đến phản ứng',
    'fantasyMode': 'Chế độ giả tưởng - Kết hợp nguyên tố theo phong cách phép thuật hoặc khoa học viễn tưởng'
  };
  
  achievements.unlockedFeatures.forEach(feature => {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success mb-2';
    alert.innerHTML = `<strong>🔓 Đã mở khóa:</strong> ${featureNames[feature] || feature}`;
    unlockedFeatures.appendChild(alert);
  });
}

// Cập nhật thanh tiến độ
function updateProgress(id, current, max) {
  const progressBar = document.getElementById(`progress-${id}`);
  const progressText = document.getElementById(`progress-${id}-text`);
  
  const percent = Math.min(100, (current / max) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${current}/${max}`;
  
  if (current >= max) {
    progressBar.classList.add('bg-success');
  }
} 