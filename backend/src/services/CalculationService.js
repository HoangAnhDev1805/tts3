const { LotteryResult } = require('../models');

/**
 * Calculation Service
 * Check win/lose and calculate payouts
 */
class CalculationService {
  /**
   * Process message result after lottery draw
   */
  async processMessageResult(message, lotteryResult) {
    const details = [];
    let totalWin = 0;
    let totalLose = message.parsed.stats.totalBet;

    for (let i = 0; i < message.parsed.lines.length; i++) {
      const line = message.parsed.lines[i];
      const { won, winAmount } = await this.checkWin(line, lotteryResult);

      details.push({
        lineIndex: i,
        won,
        winAmount,
      });

      if (won) {
        totalWin += winAmount;
      }
    }

    const profit = totalLose - totalWin;

    return {
      processed: true,
      totalWin,
      totalLose,
      profit,
      details,
    };
  }

  /**
   * Check if a betting line wins
   */
  async checkWin(line, lotteryResult) {
    const { region, number, betType } = line;
    
    // Get lottery result for the region
    const result = lotteryResult[region];
    if (!result || !result.prizes) {
      return { won: false, winAmount: 0 };
    }

    // Check based on bet type
    let won = false;

    switch (betType) {
      case 'de':
      case 'lo':
        won = this.checkDeLo(number, result.prizes);
        break;
      
      case 'dau':
        won = this.checkDau(number, result.prizes);
        break;
      
      case 'duoi':
        won = this.checkDuoi(number, result.prizes);
        break;
      
      case 'dauduoi':
        won = this.checkDauDuoi(number, result.prizes);
        break;
      
      case 'bao':
      case 'baolo':
        won = this.checkBaoLo(number, result.prizes);
        break;
      
      case 'dx':
      case 'dathang':
        won = this.checkDaThang(number, result.prizes);
        break;
      
      default:
        won = this.checkDeLo(number, result.prizes);
    }

    const winAmount = won ? line[`payout${region.toUpperCase()}`] || 0 : 0;

    return { won, winAmount };
  }

  /**
   * Check đề/lô (last 2 digits)
   */
  checkDeLo(number, prizes) {
    const allPrizes = this.getAllPrizeNumbers(prizes);
    return allPrizes.some(prize => {
      const last2 = prize.slice(-2);
      return last2 === number;
    });
  }

  /**
   * Check đầu (first digit of last 2 digits)
   */
  checkDau(number, prizes) {
    const targetDigit = number.charAt(0);
    const allPrizes = this.getAllPrizeNumbers(prizes);
    
    return allPrizes.some(prize => {
      const last2 = prize.slice(-2);
      return last2.charAt(0) === targetDigit;
    });
  }

  /**
   * Check đuôi (last digit)
   */
  checkDuoi(number, prizes) {
    const targetDigit = number.charAt(1);
    const allPrizes = this.getAllPrizeNumbers(prizes);
    
    return allPrizes.some(prize => {
      return prize.charAt(prize.length - 1) === targetDigit;
    });
  }

  /**
   * Check đầu đuôi
   */
  checkDauDuoi(number, prizes) {
    return this.checkDau(number, prizes) || this.checkDuoi(number, prizes);
  }

  /**
   * Check bao lô (both permutations)
   */
  checkBaoLo(number, prizes) {
    const reversed = number.split('').reverse().join('');
    return this.checkDeLo(number, prizes) || this.checkDeLo(reversed, prizes);
  }

  /**
   * Check đá thẳng
   */
  checkDaThang(number, prizes) {
    // TODO: Implement đá thẳng logic
    return false;
  }

  /**
   * Get all prize numbers from result
   */
  getAllPrizeNumbers(prizes) {
    const numbers = [];
    
    for (const [key, value] of Object.entries(prizes)) {
      if (key === 'special_codes' || key === 'province') continue;
      
      if (Array.isArray(value)) {
        numbers.push(...value);
      } else if (typeof value === 'object' && value.prizes) {
        // For MT/MN with multiple provinces
        numbers.push(...this.getAllPrizeNumbers(value.prizes));
      } else if (typeof value === 'string' && value) {
        numbers.push(value);
      }
    }
    
    return numbers;
  }

  /**
   * Calculate revenue statistics
   */
  async calculateRevenue(userId, startDate, endDate) {
    const { Message } = require('../models');
    
    const messages = await Message.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      'result.processed': true,
    });

    let totalBet = 0;
    let totalWin = 0;
    let totalProfit = 0;

    messages.forEach(msg => {
      totalBet += msg.result.totalLose || 0;
      totalWin += msg.result.totalWin || 0;
      totalProfit += msg.result.profit || 0;
    });

    return {
      totalBet,
      totalWin,
      totalProfit,
      messageCount: messages.length,
    };
  }
}

module.exports = new CalculationService();
