import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { ShopService } from '../shop/shop.service';
import { CreateBasketItemDto } from '../shared/DTOs/create-basket-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketItem } from './basket-item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';

@Injectable()
export class BasketService {


    constructor(
        @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
        @InjectRepository(BasketItem) private basketItemRepository: Repository<BasketItem>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async addToBasket(userId: string, itemDto: CreateBasketItemDto): Promise<BasketItem> {
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const item = this.basketItemRepository.create({
            ...itemDto,
            user: user
        });
        await this.basketItemRepository.save(item);
        return item;
    }

    async removeFromBasket(userId: string, itemId: string): Promise<void> {
        const item = await this.basketItemRepository.findOne({ where: { id: itemId, user: { id: userId } } });
        if (!item) {
            throw new NotFoundException('Item not found in basket');
        }
        await this.basketItemRepository.remove(item);
    }

    async clearBasket(userId: string): Promise<void> {
        await this.basketItemRepository.delete({ user: { id: userId } });
    }

    async getBasket(userId: string): Promise<BasketItem[]> {
        return await this.basketItemRepository.find({
            where: { user: { id: userId } }
        });
    }

    async getTotalPrice(userId: string): Promise<number> {
        let totalPrice = 0;
        const basketItems = await this.getBasket(userId);
        for (const item of basketItems) {
            const netPrice = await this.shopService.getNetPrice(item.name);
            totalPrice += netPrice * 1.23; // assuming VAT is 23%
        }
        return totalPrice;
    }

    // getAlternativeBasket(): { alternativeBasket: BasketItem[], removedItems: BasketItem[] } {
    //     const alternativeBasket = [];
    //     const removedItems = [];

    //     for (const item of this.basket) {
    //         try {
    //             this.shopService.getNetPrice(item.name);
    //             alternativeBasket.push(item);
    //         } catch (error) {
    //             if (error instanceof NotFoundException) {
    //                 removedItems.push(item);
    //             }
    //         }
    //     }

    //     return { alternativeBasket, removedItems };
    // }
}