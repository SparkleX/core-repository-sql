import {describe,it} from "mocha"
import {expect} from 'chai'
import {StudentRepo} from './StudentRepo'
import { RepositoryHandler, RepositoryFactory } from "core-repository";
import { Student } from "./Student";
import { AnsiAdapter, CrudRepositoryAdapter } from "core-repository-crud";
import {Connection} from "db-conn";
import {initSqlJs, SqlJsConnection} from "db-conn-sqljs";


class RepoHandlerImpl implements RepositoryHandler {
	conn: Connection;
	constructor(conn:Connection) {
		this.conn = conn;
	}
    async execute(sql: string, ...params: any): Promise<any> {
		console.log(sql);
		var rt = await this.conn.execute(sql, params[0]);
		return rt.recordset;
    }
}


describe(__filename, () => {
    it("findAll", async () => {
		var SQL = await initSqlJs();
		var conn:Connection = new SqlJsConnection();
		conn.open(SQL);
		await conn.execute('create table Student (id, firstName,lastName)');

		var handler = new RepoHandlerImpl(conn);
		var adapter:CrudRepositoryAdapter = new AnsiAdapter();
		var repoStudent:StudentRepo = RepositoryFactory.newRepository(StudentRepo, handler, [handler, adapter]);

		var student = new Student();
		student.id = 1;
		student.firstName = "3";
		student.lastName = "Zhang";
		await repoStudent.insert(student);
		var rt = await repoStudent.findById(1);
		expect(rt.firstName).to.equal(student.firstName);

		student.id = 2;
		student.firstName = "4";
		student.lastName = "Li";
		await repoStudent.insert(student);
		var rt = await repoStudent.findById(2);
		expect(rt.firstName).to.equal(student.firstName);

		var list = await repoStudent.findAll();
		expect(list.length).to.equal(2);

		list = await repoStudent.findByFirstName("3");
		expect(list[0].id).to.equal(1);
	});

});