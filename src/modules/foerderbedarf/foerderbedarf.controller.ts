import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { FoerderbedarfService } from "./foerderbedarf.service.js";
@ApiTags("foerderbedarf") @ApiBearerAuth() @Controller({path:"foerderbedarf",version:"1"}) export class FoerderbedarfController {
  constructor(private s:FoerderbedarfService){}
  @Post() create(@Body() dto:any){return this.s.create(dto);}
  @Get() findAll(){return this.s.findAll();}
  @Get(":id") findOne(@Param("id") id:string){return this.s.findOne(id);}
}
