type EmbedAuthor = {
  value: string;
  iconUrl: string;
}

class Embed {
  embed: {
    author?: EmbedAuthor;
    title?: string;
    description?: string;
    color?: number;
    footer?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
  }

  constructor() {
    this.embed = {};
  }

  setTitle(title: string) {
    this.embed.title = title;
    return this;
  }

  setDescription(description: string) {
    this.embed.description = description;
    return this;
  }

  addField(name: string, value: string) {
    this.embed.description = this.embed.description ? this.embed.description + '\n' + `**${name}**: ${value}` : `**${name}**: ${value}`
    return this;
  }

  setAuthor(value: string, url: string) {
    this.embed.author = {
      value: value,
      iconUrl: url
    };
    return this;
  }

  setFooter(value: string) {
    this.embed.footer = value;
    return this;
  }

  setColor(value: number) {
    this.embed.color = value;
    return this;
  }

  setImage(value: string) {
    this.embed.imageUrl = value;
    return this;
  }

  setThumbnail(value: string) {
    this.embed.thumbnailUrl = value;
    return this;
  }

  parse() {
    return {
      embed: this.embed
    }
  }
}

export default Embed;
