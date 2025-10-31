/**
 * Message Parser Service
 * Parse lottery betting messages according to dac-ta-cu-phap-day-du_v2.md
 * Supports 40 bet types across 3 regions
 */

class MessageParserService {
  constructor() {
    // Province codes mapping
    this.provinceCodes = {
      // Miền Bắc
      mb: ['dc', 'hn'],
      // Miền Trung
      mt: ['dn', 'kh', 'qt', 'bdi', 'gl', 'nt', 'qb', 'qni', 'dno', 'ktu'],
      // Miền Nam
      mn: ['tp', 'hcm', 'dt', 'cm', 'br', 'vt', 'bi', 'tn', 'an', 'bt', 'vl', 'bn', 'tv', 'la', 'tg', 'kg', 'dl', 'ttau'],
    };

    // Bet type patterns
    this.betTypePatterns = {
      // Basic types
      de: /\bde?\b|\bd\b/i,
      lo: /\blo\b|\bl\b/i,
      dau: /\bdau\b|\bda\b/i,
      duoi: /\bduoi\b|\bdu\b/i,
      dauduoi: /\bdauduoi\b|\bdadu\b/i,
      
      // Xiên
      dx: /\bdx\b|\bdxien\b/i,
      xien2: /\bx2\b|\bxien2\b/i,
      xien3: /\bx3\b|\bxien3\b/i,
      xien4: /\bx4\b|\bxien4\b/i,
      
      // Bao
      bao: /\bbao\b|\bb\b/i,
      baolo: /\bbaolo\b|\bbl\b/i,
      
      // 3-4 số
      '3c': /\b3c\b|\b3cang\b/i,
      '4c': /\b4c\b|\b4cang\b/i,
      
      // Đài
      '2dai': /\b2dai\b|\b2d\b/i,
      '3dai': /\b3dai\b|\b3d\b/i,
      '4dai': /\b4dai\b|\b4d\b/i,
      
      // Special
      xiuchu: /\bxc\b|\bxiuchu\b/i,
      dathang: /\bdathang\b|\bdt\b/i,
    };
  }

  /**
   * Main parse function
   */
  async parseMessage(content, contactId, date, regions, pricingConfig) {
    const lines = content.trim().split('\n').filter(line => line.trim());
    const parsedLines = [];
    let lineNumber = 0;

    for (const line of lines) {
      try {
        const parsed = await this.parseLine(line, contactId, regions, pricingConfig);
        parsedLines.push(...parsed.map(p => ({ ...p, stt: ++lineNumber })));
      } catch (error) {
        console.error('Error parsing line:', line, error);
      }
    }

    // Calculate stats
    const stats = this.calculateStats(parsedLines);

    return {
      success: true,
      lines: parsedLines,
      stats,
    };
  }

  /**
   * Parse a single line
   */
  async parseLine(line, contactId, regions, pricingConfig) {
    const result = [];
    line = line.toLowerCase().trim();

    // Detect province/region
    const { region, province } = this.detectRegionAndProvince(line);
    
    // Detect bet type
    const betType = this.detectBetType(line);
    
    // Extract numbers
    const numbers = this.extractNumbers(line, betType);
    
    // Extract points/amount
    const points = this.extractPoints(line);

    // Get pricing
    const pricing = this.getPricing(pricingConfig, region, betType);

    // Create parsed lines for each number
    for (const number of numbers) {
      const totalBet = points * pricing.giaBan * 1000;
      const payout = points * pricing.tienThang * 1000;

      result.push({
        region: region || regions[0],
        province: province || this.getDefaultProvince(region || regions[0]),
        betType,
        number,
        points,
        pricePerPoint: pricing.giaBan,
        totalBet,
        payoutMB: regions.includes('mb') ? payout : 0,
        payoutMT: regions.includes('mt') ? payout : 0,
        payoutMN: regions.includes('mn') ? payout : 0,
      });
    }

    return result;
  }

  /**
   * Detect region and province from line
   */
  detectRegionAndProvince(line) {
    for (const [region, codes] of Object.entries(this.provinceCodes)) {
      for (const code of codes) {
        if (line.includes(code)) {
          return { region, province: code };
        }
      }
    }
    return { region: null, province: null };
  }

  /**
   * Detect bet type
   */
  detectBetType(line) {
    for (const [type, pattern] of Object.entries(this.betTypePatterns)) {
      if (pattern.test(line)) {
        return type;
      }
    }
    return 'de'; // default
  }

  /**
   * Extract numbers from line
   */
  extractNumbers(line, betType) {
    const numbers = [];
    
    // Remove bet type keywords
    let cleanLine = line.replace(/\b(de|lo|dx|bao|d|l|b|dau|duoi|xien|dai|x)\d*\b/gi, '');
    
    // Extract 2-digit numbers
    const matches = cleanLine.match(/\b\d{2}\b/g);
    if (matches) {
      numbers.push(...matches);
    }

    return numbers.length > 0 ? numbers : ['00'];
  }

  /**
   * Extract points/amount
   */
  extractPoints(line) {
    // Look for patterns like: lo10, dx5, 10n, 5k
    const pointMatch = line.match(/(\d+)([nkđ]?)\b/);
    if (pointMatch) {
      let points = parseInt(pointMatch[1]);
      const unit = pointMatch[2];
      
      if (unit === 'k') points = points * 10;
      if (unit === 'đ') points = points / 1000;
      
      return points;
    }
    return 10; // default 10 points
  }

  /**
   * Get pricing from config
   */
  getPricing(pricingConfig, region, betType) {
    const regionConfig = pricingConfig[region] || pricingConfig.mb;
    const pricing = regionConfig[betType] || regionConfig.de;
    
    return pricing || { giaBan: 0.75, tienThang: 75 };
  }

  /**
   * Get default province for region
   */
  getDefaultProvince(region) {
    const defaults = {
      mb: 'dc',
      mt: 'dn',
      mn: 'tp',
    };
    return defaults[region] || 'dc';
  }

  /**
   * Calculate statistics
   */
  calculateStats(lines) {
    return {
      totalLines: lines.length,
      totalBet: lines.reduce((sum, line) => sum + line.totalBet, 0),
      totalPayoutMB: lines.reduce((sum, line) => sum + line.payoutMB, 0),
      totalPayoutMT: lines.reduce((sum, line) => sum + line.payoutMT, 0),
      totalPayoutMN: lines.reduce((sum, line) => sum + line.payoutMN, 0),
      maxPayout: Math.max(
        lines.reduce((sum, line) => sum + line.payoutMB, 0),
        lines.reduce((sum, line) => sum + line.payoutMT, 0),
        lines.reduce((sum, line) => sum + line.payoutMN, 0)
      ),
    };
  }

  /**
   * Parse advanced syntax (for future expansion)
   * Examples:
   * - dc 12 34 lo10 bao20 dau5
   * - 2d 11 22 33 dx10
   * - 3dai 56 78 lo15
   */
  async parseAdvancedSyntax(line) {
    // TODO: Implement advanced parsing logic
    // This would handle complex cases from dac-ta-cu-phap-day-du_v2.md
    return [];
  }
}

module.exports = new MessageParserService();
