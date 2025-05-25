
export class SlugGenerators {
  /**
   * Ice-spesifikk slug: "Ice Smart 20GB" -> "20-gb"
   */
  static generateIceSlug(planName: string): string {
    console.log(`🧊 Generating Ice slug from: "${planName}"`);
    
    // Fjern "Ice" prefix og common words
    let cleanName = planName.replace(/^Ice\s*/i, '').replace(/Smart\s*/i, '').trim();
    console.log(`🧹 Cleaned name: "${cleanName}"`);
    
    // Prioriter datamengde-matching
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb|tb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      const slug = `${amount}-${unit}`;
      console.log(`📊 Data match found: ${slug}`);
      return slug;
    }
    
    // Fallback til standard slugify
    const fallback = this.slugify(cleanName);
    console.log(`🔄 Fallback slug: ${fallback}`);
    return fallback;
  }
  
  /**
   * Talkmore-spesifikk slug
   */
  static generateTalkmoreSlug(planName: string): string {
    console.log(`📞 Generating Talkmore slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^Talkmore\s*/i, '').trim();
    
    // Check for data plans
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `${amount}${unit}`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * OneCall-spesifikk slug
   */
  static generateOneCallSlug(planName: string): string {
    console.log(`☎️ Generating OneCall slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^OneCall\s*/i, '').trim();
    
    // Check for data plans
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `${amount}-${unit}`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * MyCall-spesifikk slug (bruker productId)
   */
  static generateMyCallSlug(planName: string): string {
    console.log(`📱 Generating MyCall slug from: "${planName}"`);
    return this.slugify(planName);
  }
  
  /**
   * Chilimobil-spesifikk slug
   */
  static generateChilimobilSlug(planName: string): string {
    console.log(`🌶️ Generating Chilimobil slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^Chilimobil\s*/i, '').trim();
    
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `abonnement-${amount}${unit}`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * Happybytes-spesifikk slug
   */
  static generateHappybytesSlug(planName: string): string {
    console.log(`😊 Generating Happybytes slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^Happybytes\s*/i, '').trim();
    
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `${amount}-${unit}-abonnement`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * PlussMobil-spesifikk slug
   */
  static generatePlussmobilSlug(planName: string): string {
    console.log(`➕ Generating PlussMobil slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^PlussMobil\s*/i, '').trim();
    
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `mobil-${amount}${unit}`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * Saga-spesifikk slug
   */
  static generateSagaSlug(planName: string): string {
    console.log(`⚔️ Generating Saga slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^Saga\s*/i, '').trim();
    
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `saga-${amount}${unit}`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * Release-spesifikk slug
   */
  static generateReleaseSlug(planName: string): string {
    console.log(`🚀 Generating Release slug from: "${planName}"`);
    
    let cleanName = planName.replace(/^Release\s*/i, '').trim();
    
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `${amount}${unit}-abonnement`;
    }
    
    return this.slugify(cleanName);
  }
  
  /**
   * Standard slug-generering
   */
  static generateStandardSlug(planName: string): string {
    console.log(`🔧 Generating standard slug from: "${planName}"`);
    
    // Check for data plans først
    const dataMatch = planName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `${amount}-${unit}`;
    }
    
    return this.slugify(planName);
  }
  
  /**
   * Konverter tekst til URL-slug
   */
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[æåø]/g, (match) => {
        const replacements: { [key: string]: string } = { 'æ': 'ae', 'å': 'aa', 'ø': 'oe' };
        return replacements[match] || match;
      })
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
