import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CacheItem } from './cache.entity';

@Injectable()
export class CacheService {
    constructor(
        @InjectRepository(CacheItem)
        private cacheRepository: Repository<CacheItem>,
    ) { }

    async getFromCache(key: string): Promise<any> {
        const cacheEntry = await this.cacheRepository.findOne({ where: { key } });
        return cacheEntry ? cacheEntry.dataJson : null;
    }

    async saveToCache(value: any, controllerName: string, actionName: string): Promise<void> {
        const cacheEntry = this.cacheRepository.create({ dataJson: value, controllerName, actionName });
        await this.cacheRepository.save(cacheEntry);
    }

    // Metoda do czyszczenia starych wpisów (na podstawie daty utworzenia i czasu życia)
}
