import { APIEmbed } from '../types'

class Embed {
  embed: APIEmbed

  constructor () {
    this.embed = {}
  }

  setTitle (title: string): this {
    this.embed.title = title
    return this
  }

  setDescription (description: string): this {
    this.embed.description = description
    return this
  }

  addField (name: string, value: string): this {
    this.embed.description = this.embed.description ? this.embed.description + '\n' + `**${name}**: ${value}` : `**${name}**: ${value}`
    return this
  }

  setAuthor (value: string, url: string): this {
    this.embed.author = {
      value: value,
      iconUrl: url
    }
    return this
  }

  setFooter (value: string): this {
    this.embed.footer = value
    return this
  }

  setColor (value: number): this {
    this.embed.color = value
    return this
  }

  setImage (value: string): this {
    this.embed.imageUrl = value
    return this
  }

  setThumbnail (value: string): this {
    this.embed.thumbnailUrl = value
    return this
  }

  parse (): { embed: APIEmbed } {
    return {
      embed: this.embed
    }
  }
}

export default Embed
