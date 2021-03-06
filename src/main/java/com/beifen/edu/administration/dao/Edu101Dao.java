package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu101;

@Configuration
public interface Edu101Dao extends JpaRepository<Edu101, Long>, JpaSpecificationExecutor<Edu101> {
	// 根据id查询教师姓名
	@Query(value = "select b.xm from edu101 b where b.Edu101_ID=?1", nativeQuery = true)
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

	//审批结束后回写状态
	@Transactional
	@Modifying
	@Query(value = "update edu101 set wpjzgspzt=?2 where Edu101_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state);


	//根据用户ID查找教师信息
	@Query(value = "select e.* from Edu992 d, Edu101 e, Edu990 f where d.BF990_ID = f.BF990_ID and f.user_key = e.edu101_ID and d.BF990_ID = ?1", nativeQuery = true)
	Edu101 getTeacherInfoByEdu990Id(String edu990Id);

	//根据用户权限查找教师
	@Query(value = "select e.* from edu101 e where e.SZXB in ?1",nativeQuery = true)
    List<Edu101> queryAllTeacherByUserId(List<String> departments);

	//根据专业查找教师人数
	@Query(value = "select count(e.Edu101_ID) from edu101 e where e.zy = ?1", nativeQuery = true)
    Integer countByEdu106Id(Long edu106_id);
}
