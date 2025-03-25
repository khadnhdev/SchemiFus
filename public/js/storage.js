// Quản lý lưu trữ dữ liệu sử dụng localStorage
const StorageManager = {
  // Lưu phản ứng
  saveReaction: function(reaction) {
    let reactions = this.getReactions();
    reactions.unshift({...reaction, id: Date.now(), savedAt: new Date().toISOString()});
    
    // Giới hạn số lượng phản ứng lưu trữ
    if (reactions.length > 50) {
      reactions = reactions.slice(0, 50);
    }
    
    localStorage.setItem('chemistry_reactions', JSON.stringify(reactions));
    
    // Kiểm tra và thêm thành tích
    this.checkReactionAchievements(reactions);
    
    return true;
  },
  
  // Lấy danh sách phản ứng
  getReactions: function() {
    return JSON.parse(localStorage.getItem('chemistry_reactions') || '[]');
  },
  
  // Xóa phản ứng theo ID
  deleteReaction: function(id) {
    let reactions = this.getReactions();
    reactions = reactions.filter(r => r.id !== id);
    localStorage.setItem('chemistry_reactions', JSON.stringify(reactions));
    return true;
  },
  
  // Lưu thành tích
  saveAchievement: function(achievement) {
    let achievements = this.getAchievements();
    
    // Kiểm tra xem thành tích đã tồn tại chưa
    if (!achievements.some(a => a.id === achievement.id)) {
      achievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString()
      });
      
      localStorage.setItem('chemistry_achievements', JSON.stringify(achievements));
      return true;
    }
    
    return false;
  },
  
  // Lấy danh sách thành tích
  getAchievements: function() {
    return JSON.parse(localStorage.getItem('chemistry_achievements') || '[]');
  },
  
  // Kiểm tra và cấp thành tích dựa trên số lượng phản ứng
  checkReactionAchievements: function(reactions) {
    const reactionsCount = reactions.length;
    
    if (reactionsCount >= 5) {
      this.saveAchievement({
        id: 'collector',
        title: 'Nhà Sưu Tầm',
        description: 'Đã lưu 5 phản ứng',
        icon: 'fa-book'
      });
    }
    
    if (reactionsCount >= 10) {
      this.saveAchievement({
        id: 'researcher',
        title: 'Nhà Nghiên Cứu',
        description: 'Đã lưu 10 phản ứng',
        icon: 'fa-microscope'
      });
    }
    
    if (reactionsCount >= 20) {
      this.saveAchievement({
        id: 'scientist',
        title: 'Nhà Khoa Học',
        description: 'Đã lưu 20 phản ứng',
        icon: 'fa-flask-vial'
      });
    }
  },
  
  // Lưu điểm số
  saveScore: function(score) {
    localStorage.setItem('chemistry_score', score);
  },
  
  // Lấy điểm số
  getScore: function() {
    return parseInt(localStorage.getItem('chemistry_score') || '0');
  }
}; 