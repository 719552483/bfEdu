package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu001;

public interface Edu001Dao extends JpaRepository<Edu001, Long>, JpaSpecificationExecutor<Edu001> {
	// 按行政班搜索学生
	@Query(value = "select * from edu001 b where b.Edu300_ID=?1", nativeQuery = true)
	public List<Edu001> queryStudentInfoByAdministrationClass(String xzbCode);

	// 按行政班ID填充学生的教学班信息
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu001 SET jxbname =?1,Edu301_ID =?2 WHERE Edu300_ID =?3", nativeQuery = true)
	public void stuffStudentTeachingClassInfoBy300id(String jxbname, Long edu301_ID, String xzbcode);

	// 按学生id填充学生的教学班信息
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu001 SET jxbname =?1,Edu301_ID =?2 WHERE Edu001_ID =?3", nativeQuery = true)
	public void stuffStudentTeachingClassInfoby001id(String jxbname, Long edu301_ID, String studentid);

	// 修改行政班时修改行政班下学生的行政班信息
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu001 set xzbname =?2 WHERE Edu300_ID =?1", nativeQuery = true)
	public void updateStudentAdministrationInfo(String edu300_ID, String jxbname);

	// 查询学生所在行政班
	@Query(value = "select e.Edu300_ID from  edu001 e where e.Edu001_ID=?1", nativeQuery = true)
	public String queryStudentXzbCode(String edu001Id);
	
	// 根据id查询学生信息
	@Query(value = "select * from  edu001 e where e.Edu001_ID=?1", nativeQuery = true)
	public Edu001 queryStudentBy001ID(String edu001Id);


	// 查询培养计划下所有学生
	@Query(value = "select * from edu001 e where e.pycc =? and e.szxb=? and e.nj =? and e.zybm=?", nativeQuery = true)
	public List<Edu001> queryCulturePlanStudent(String levelCode, String departmentCode, String gradeCode,String majorCode);

	// 删除学生
	@Transactional
	@Modifying
	@Query(value = "delete from edu001 where edu001_id =?1", nativeQuery = true)
	public void removeStudentByID(long studentId);

	// 统计行政班总人数
	@Query(value = "select COUNT(*) from edu001 e where e.Edu300_ID  =?1", nativeQuery = true)
	int countXzbRS(String edu300_ID);

	//身份证是否存在
	@Query(value = "select * from edu001 e where e.sfzh=?1", nativeQuery = true)
	public List<Edu001> IDcardIshave(String sfzh);

	//批量发放毕业证
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu001 set zt_code ='graduation',zt='毕业' WHERE Edu001_ID =?1", nativeQuery = true)
	public void graduationStudents(String edu001Id);

	//根据id查学生学号
	@Query(value = "select e.xh from edu001 e where e.Edu001_ID =?1", nativeQuery = true)
	public String queryXhBy001ID(String edu001_ID);
}
