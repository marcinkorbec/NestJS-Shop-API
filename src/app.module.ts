import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimingInterceptor } from './timing.decorator';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BasketModule } from './basket/basket.module';
import { ShopModule } from './shop/shop.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './shop/shop-item.entity';
import { AdministratorModule } from './administrator/administrator.module';
import { DiscountModule } from './discount/discount.module';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { HashingModule } from './hashing-pwd/hashing-pwd.module';
@Module({
    imports: [
        HashingModule,
        TypeOrmModule.forRoot({ entities: [ShopItem] }),
        BasketModule,
        ShopModule,
        UsersModule,
        AdministratorModule,
        DiscountModule,
        CronModule,
        MailModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TimingInterceptor,
        },
        CronService,
    ],
})
export class AppModule {
}
