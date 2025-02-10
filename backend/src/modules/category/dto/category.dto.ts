import { Expose } from "class-transformer";

@Expose()
export class ResultCategoryDto {
    @Expose({name: 'id'})
    categoryId: string;
    
    @Expose({name: 'name'})
    categoryName: string;   
}