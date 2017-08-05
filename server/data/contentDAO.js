import models from '../model/index';

export default class{
	static getContentById(id){
		models.content.findAll({where:{id: id}});
	}
}
