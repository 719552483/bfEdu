package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu101;

@Configuration
public interface Edu101Dao extends JpaRepository<Edu101, Long>, JpaSpecificationExecutor<Edu101> {
	// 根据id查询教师姓名
	@Query(value = "select b.jsxm from edu101 b where b.Edu101_ID=?1", nativeQuery = true)
	public String queryTeacherById(Long techerId);

	// 根据id删除教师
	@Transactional
	@Modifying
	@Query(value = "delete from edu101 where Edu101_ID =?1", nativeQuery = true)
	void removeTeacher(String edu101id);

	// 查询教师身份证号是否已存在
	@Query(value = "select * from edu101 e where e.sfzh=?1", nativeQuery = true)
	public List<Edu101> teacherIDcardIshave(String sfzh);

	// 根据id查询教师所有信息
	@Query(value = "select * from edu101 e where e.Edu101_ID=?1", nativeQuery = true)
	public Edu101 queryTeacherBy101ID(String techerId);

	// 根据id查询教职工号
	@Query(value = "select e.jzgh from edu101 e where e.Edu101_ID=?1", nativeQuery = true)
	public String queryJzghBy101ID(String techerId);
}
