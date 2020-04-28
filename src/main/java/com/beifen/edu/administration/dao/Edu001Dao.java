package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu001;

public interface Edu001Dao extends JpaRepository<Edu001, Long>, JpaSpecificationExecutor<Edu001> {

	// 查询所有学生编码
	@Query(value = "select * from  edu001", nativeQuery = true)
	public List<Edu001> queryAllDiseases();

	// 删除学生
	@Transactional
	@Modifying
	@Query(value = "delete from edu001 where edu001_id =?1", nativeQuery = true)
	void deleteDiseaseCodeing(String bf003_id);

	// 按学号搜索学生
	@Query(value = "select * from edu001 b where b.xh like ?1%", nativeQuery = true)
	public List<Edu001> queryAllDiseasesByCodeing(String xh);

	// 按行政班搜索学生
	@Query(value = "select * from edu001 b where b.xzbcode=?1", nativeQuery = true)
	public List<Edu001> queryStudentInfoByAdministrationClass(String xzbCode);

	//添加教学班的同时更新学生教学班信息
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu001 SET jxbname =?1,Edu301_ID =?2 WHERE xzbcode =?3", nativeQuery = true)
	public void stuffStudentTeachingClassInfo(String jxbname,Long edu301_ID,String xzbcode);

	@Query(value = "select e.xzbcode from  edu001 e where e.Edu001_ID=?1", nativeQuery = true)
	public String queryStudentXzbCode(String edu001Id);

}
