/**
 * Created by ling on 03.12.16.
 */
import models from '../model/index';

export default class{


	static getCountries(){
		return models.country.findAll({attributes:['id', 'name']});
	}

}
