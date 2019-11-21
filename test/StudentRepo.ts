import { CrudRepository, CrudRepositoryAdapter } from "core-repository-crud"
import { Student } from './Student';
import { RepositoryHandler, Query } from "core-repository";

export class StudentRepo extends CrudRepository<Student, Number> {
	public constructor(handler : RepositoryHandler, adapter:CrudRepositoryAdapter) {
		super(handler, adapter, Student);
	}

	@Query(`select * from "Student" where "firstName"=?`)
	public async findByFirstName(firstName:string):Promise<Student[]> {return null}
}