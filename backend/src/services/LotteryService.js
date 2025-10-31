const axios = require('axios');
const cheerio = require('cheerio');
const { LotteryResult } = require('../models');
const { formatDate } = require('../utils/helpers');

class LotteryService {
  constructor() {
    this.baseUrl = process.env.LOTTERY_API_URL || 'https://az24.vn';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
  }

  /**
   * Crawl lottery data for a specific region and date
   */
  async crawlLotteryData(region, date) {
    try {
      const url = `/${region}-${date}.html`;
      const response = await this.client.get(url);
      const html = response.data;

      let result;
      switch (region) {
        case 'xsmb':
          result = this.parseNorthernResult(html, date);
          break;
        case 'xsmt':
          result = this.parseCentralResult(html, date);
          break;
        case 'xsmn':
          result = this.parseSouthernResult(html, date);
          break;
        default:
          throw new Error('Invalid region');
      }

      // Save to database
      await this.saveToDatabase(result, region, date);

      return result;
    } catch (error) {
      console.error(`Error crawling lottery data for ${region} ${date}:`, error.message);
      throw error;
    }
  }

  /**
   * Parse Northern region result (Miền Bắc)
   */
  parseNorthernResult(html, date) {
    const $ = cheerio.load(html);
    const result = {
      meta: this.generateMeta('xsmb', date),
      prizes: {},
    };

    const table = $('#load_kq_mb_0 table.colgiai');
    
    // Parse prizes
    result.prizes.db = table.find('.v-gdb').first().text().trim();
    result.prizes.g1 = table.find('.v-g1').first().text().trim();
    
    result.prizes.g2 = [];
    table.find('[class*="v-g2"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) result.prizes.g2.push(text);
    });

    result.prizes.g3 = [];
    table.find('[class*="v-g3"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) result.prizes.g3.push(text);
    });

    result.prizes.g4 = [];
    table.find('[class*="v-g4"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) result.prizes.g4.push(text);
    });

    result.prizes.g5 = [];
    table.find('[class*="v-g5"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) result.prizes.g5.push(text);
    });

    result.prizes.g6 = [];
    table.find('[class*="v-g6"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) result.prizes.g6.push(text);
    });

    result.prizes.g7 = [];
    table.find('[class*="v-g7"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text) result.prizes.g7.push(text);
    });

    return result;
  }

  /**
   * Parse Central region result (Miền Trung)
   */
  parseCentralResult(html, date) {
    const $ = cheerio.load(html);
    const result = {
      meta: this.generateMeta('xsmt', date),
      prizes: {},
    };

    const table = $('#load_kq_mt_0 table.colgiai');
    
    // Get provinces
    const provinces = [];
    table.find('tr.gr-yellow th a').each((i, el) => {
      const name = $(el).text().trim();
      const code = $(el).parent().attr('data-pid');
      if (name && code) {
        provinces.push({ name, code });
      }
    });

    // Parse each province
    provinces.forEach((province, index) => {
      const colIndex = index + 1;
      result.prizes[province.code] = {
        province,
        db: this.extractPrize($, table, 'gdb', colIndex),
        g1: this.extractPrize($, table, 'g1', colIndex),
        g2: this.extractPrize($, table, 'g2', colIndex),
        g3: this.extractPrize($, table, 'g3', colIndex),
        g4: this.extractPrize($, table, 'g4', colIndex),
        g5: this.extractPrize($, table, 'g5', colIndex),
        g6: this.extractPrize($, table, 'g6', colIndex),
        g7: this.extractPrize($, table, 'g7', colIndex),
        g8: this.extractPrize($, table, 'g8', colIndex),
      };
    });

    return result;
  }

  /**
   * Parse Southern region result (Miền Nam)
   */
  parseSouthernResult(html, date) {
    const $ = cheerio.load(html);
    const result = {
      meta: this.generateMeta('xsmn', date),
      prizes: {},
    };

    const table = $('#load_kq_mn_0 table.colgiai');
    
    // Get provinces
    const provinces = [];
    table.find('tr.gr-yellow th a').each((i, el) => {
      const name = $(el).text().trim();
      const code = $(el).parent().attr('data-pid');
      if (name && code) {
        provinces.push({ name, code });
      }
    });

    // Parse each province (same as Central)
    provinces.forEach((province, index) => {
      const colIndex = index + 1;
      result.prizes[province.code] = {
        province,
        db: this.extractPrize($, table, 'gdb', colIndex),
        g1: this.extractPrize($, table, 'g1', colIndex),
        g2: this.extractPrize($, table, 'g2', colIndex),
        g3: this.extractPrize($, table, 'g3', colIndex),
        g4: this.extractPrize($, table, 'g4', colIndex),
        g5: this.extractPrize($, table, 'g5', colIndex),
        g6: this.extractPrize($, table, 'g6', colIndex),
        g7: this.extractPrize($, table, 'g7', colIndex),
        g8: this.extractPrize($, table, 'g8', colIndex),
      };
    });

    return result;
  }

  /**
   * Extract prize from table
   */
  extractPrize($, table, prizeClass, colIndex) {
    const row = table.find(`tr.${prizeClass}`);
    if (row.length === 0) return '';

    const cell = row.find('td').eq(colIndex);
    if (cell.length === 0) return '';

    const divs = cell.find('div');
    if (divs.length === 0) {
      return cell.text().trim();
    }

    const numbers = [];
    divs.each((i, el) => {
      const text = $(el).text().trim();
      if (text) numbers.push(text);
    });

    return numbers.length > 1 ? numbers : numbers[0] || '';
  }

  /**
   * Generate metadata
   */
  generateMeta(region, date) {
    const regionNames = {
      xsmb: 'Miền Bắc',
      xsmt: 'Miền Trung',
      xsmn: 'Miền Nam',
    };

    const [day, month, year] = date.split('-');
    const dateObj = new Date(year, month - 1, day);

    return {
      region: {
        code: region,
        name: regionNames[region],
      },
      date: {
        original: date,
        formatted: dateObj.toISOString().split('T')[0],
        display: `${day}/${month}/${year}`,
        dayOfWeek: dateObj.toLocaleDateString('vi-VN', { weekday: 'long' }),
      },
    };
  }

  /**
   * Save result to database
   */
  async saveToDatabase(result, region, date) {
    const data = {
      date,
      region: region.replace('xs', ''),
      [region.replace('xs', '')]: result,
    };

    await LotteryResult.findOneAndUpdate(
      { date, region: region.replace('xs', '') },
      data,
      { upsert: true, new: true }
    );
  }

  /**
   * Get lottery result from database
   */
  async getResult(region, date) {
    const result = await LotteryResult.findOne({ region, date });
    return result ? result[region] : null;
  }

  /**
   * Crawl all regions for a specific date
   */
  async crawlAllRegions(date) {
    const results = {};
    
    try {
      results.mb = await this.crawlLotteryData('xsmb', date);
    } catch (error) {
      console.error('Error crawling MB:', error.message);
      results.mb = null;
    }

    try {
      results.mt = await this.crawlLotteryData('xsmt', date);
    } catch (error) {
      console.error('Error crawling MT:', error.message);
      results.mt = null;
    }

    try {
      results.mn = await this.crawlLotteryData('xsmn', date);
    } catch (error) {
      console.error('Error crawling MN:', error.message);
      results.mn = null;
    }

    return results;
  }
}

module.exports = new LotteryService();
