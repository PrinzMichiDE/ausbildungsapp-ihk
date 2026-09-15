import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UebernahmegespraechService } from "./uebernahme.service.js";
@ApiTags("uebernahme") @ApiBearerAuth() @Controller({path:"uebernahme",version:"1"}) export class UebernahmegespraechController {
  constructor(private s:UebernahmegespraechService){}
  @Post() create(@Body() dto:any){return this.s.create(dto);}
  @Get() findAll(){return this.s.findAll();}
  @Get(":id") findOne(@Param("id") id:string){return this.s.findOne(id);}
}
