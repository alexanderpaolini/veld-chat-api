"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
class Embed {
    constructor() {
        this.embed = {};
    }
    setTitle(title) {
        this.embed.title = title;
        return this;
    }
    setDescription(description) {
        this.embed.description = description;
        return this;
    }
    addField(name, value) {
        this.embed.description = this.embed.description ? this.embed.description + '\n' + `**${name}**: ${value}` : `**${name}**: ${value}`;
        return this;
    }
    setAuthor(value, url) {
        this.embed.author = {
            value: value,
            iconUrl: url
        };
        return this;
    }
    setFooter(value) {
        this.embed.footer = value;
        return this;
    }
    setColor(value) {
        this.embed.color = value;
        return this;
    }
    setImage(value) {
        this.embed.imageUrl = value;
        return this;
    }
    setThumbnail(value) {
        this.embed.thumbnailUrl = value;
        return this;
    }
    parse() {
        return {
            embed: this.embed
        };
    }
}
exports.Embed = Embed;
