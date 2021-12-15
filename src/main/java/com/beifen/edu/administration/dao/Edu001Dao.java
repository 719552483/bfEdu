package com.beifen.edu.administration.dao;

import java.util.List;

import com.beifen.edu.administration.PO.EchartPO;
import com.beifen.edu.administration.domian.Edu101;
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
	@Query(value = "UPDATE edu001 set zt_code ='004',zt='毕业' WHERE Edu001_ID =?1", nativeQuery = true)
	public void graduationStudents(String edu001Id);

	//根据id查学生学号
	@Query(value = "select e.edu001_id from edu001 e where e.xh =?1", nativeQuery = true)
	public String query001IDByXh(String edu001_ID);

	//根据id查学生学号
	@Query(value = "select e.* from edu001 e where e.xh =?1", nativeQuery = true)
	public Edu001 query001ByXh(String xh);


	//审批结束后回写状态
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu001 set zt_code =?2, zt=?3  WHERE Edu001_ID =?1", nativeQuery = true)
    void updateState(String businessKey, String state, String stateName);

	//根据用户ID查找学生信息
	@Query(value = "select e.* from Edu992 d, Edu001 e, Edu990 f where d.BF990_ID = f.BF990_ID and f.user_key = e.edu001_ID and d.BF990_ID = ?1", nativeQuery = true)
	Edu001 getStudentInfoByEdu990Id(String currentUserId);

	//查询行政班所有学生
	@Query(value = "select e.* from Edu001 e where e.edu300_ID in ?1 order by e.xzbname",nativeQuery = true)
	List<Edu001> getStudentInEdu300(List<String> edu300IdList);


	//根据用户二级学院权限查询学生
	@Query(value = "select e.* from edu001 e where e.szxb in ?1",nativeQuery = true)
	List<Edu001> findAllByDepartments(List<String> departments);

	//根据专业查找学生人数
	@Query(value = "select count(e.Edu001_ID) from edu001 e where e.zybm = ?1",nativeQuery = true)
    Integer countByEdu106Id(Long edu106_id);

	//根据年龄查找学生人数
	@Query(value = "select count(e.Edu001_ID) from edu001 e,edu300 t where e.Edu300_ID = t.Edu300_ID and (e.nl between ?1 and ?2) and t.njbm in ?3 and t.batch in ?4  ",nativeQuery = true)
	Integer getStudentByAge(String s, String s1,List<Long> schoolYearCodeList,List<String> batchCodeList);

	//根据二级学院查找各年龄段学生人数
	@Query(value = "select count(e.Edu001_ID) from edu001 e, edu300 t where e.Edu300_ID = t.Edu300_ID and (e.nl between ?1 and ?2) and e.szxb = ?3 and t.njbm in ?4 and t.batch in ?5",nativeQuery = true)
	Integer getStudentByAgeWithDepartment(String s, String s1, String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList);

	//根据生源类型查询学生人数
	@Query(value = "select t.sylx name,to_char(count(t.edu001_ID)) value from Edu001 t, Edu300 m where t.edu300_ID = m.edu300_ID and m.njbm in ?1 and m.batch in ?2 group by t.sylx",nativeQuery = true)
	List<Object[]> getStudentByJob(List<Long> schoolYearCodeList,List<String> batchCodeList);

	//根据生源类型查询学生人数
	@Query(value = "select t.sylx name,to_char(count(t.edu001_ID)) value from Edu001 t group by t.sylx",nativeQuery = true)
	List<Object[]> getStudentByJob();

	//根据二级学院查询各生源类型学生人数
	@Query(value = "select t.sylx name,to_char(count(t.edu001_ID)) value from Edu001 t, Edu300 m where t.edu300_ID = m.edu300_ID and t.szxb = ?1 and m.njbm in ?2 and m.batch in ?3 group by t.sylx",nativeQuery = true)
	List<Object[]> getStudentByJobWithDepatrment(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList);

	//查询在校学生
	@Query(value = "select count(1) from edu001 e where e.zt_code in ('001','007','006')",nativeQuery = true)
    Long findAllStudent();

	//查询身份证号是否存在
	@Query(value = "select * from edu001 e where e.sfzh = ?1 and e.Edu001_ID <> ?2 ",nativeQuery = true)
	List<Edu001> checkIdCard(String sfzh, Long edu001_id);

	//查询学号是否存在
	@Query(value = "select * from edu001 e where e.xh = ?1 and e.Edu001_ID <> ?2 ",nativeQuery = true)
	List<Edu001> checkXH(String xh, Long edu001_id);

	@Query(value = "select count(*) from edu001 e where EDU300_ID in ?1 and xb = ?2 and sylxbm = ?3",nativeQuery = true)
	String queryStudentCount(List<Long> edu300ids,String xb,String sylx);

	@Query(value = "select count(*) from edu001 e where EDU300_ID in ?1 and xb = ?2",nativeQuery = true)
	String queryStudentCount(List<Long> edu300ids,String xb);

	@Query(value = "select count(*) from edu001 e where EDU300_ID in ?1",nativeQuery = true)
	String queryStudentCount(List<Long> edu300ids);

	@Query(value = "select count(*) from edu001 e where EDU300_ID in ?1 and xb = ?2 and (zt_code = '002' or zt_code = '003')",nativeQuery = true)
	String queryStudentCode(List<Long> edu300ids,String xb);

	//查询可毕业学生
	@Query(value = " select * from edu001 e where edu300_id in ?1 and ZT_CODE = '001' and (select count(*) from edu005 where STUDENT_CODE = e.xh and (IS_PASSED = 'F' or IS_PASSED is null)) = 0",nativeQuery = true)
	List<Edu001> findGraduationStudents(List<String> edu300ids);

	//查询可毕业学生
	@Query(value = " select * from edu001 e where szxb = ?1 and nj = ?2 and zybm = ?3 and ZT_CODE = '001' and (select count(*) from edu005 where STUDENT_CODE = e.xh and (IS_PASSED = 'F' or IS_PASSED is null)) = 0",nativeQuery = true)
	List<Edu001> findGraduationStudents(String xb,String nj,String zy);

	//根据性别查询总人数
	@Query(value = "select count(1) from edu001 e where e.zt_code in ('001','007','006') and xb = ?1",nativeQuery = true)
	Long findAllStudentByXb(String xb);

	//根据年级查询总数
	@Query(value = "select count(1) from edu001 e where e.zt_code in ('001','007','006') and nj = ?1",nativeQuery = true)
	Long findAllStudentByNj(String nj);

	//根据年级性别查询总数
	@Query(value = "select count(1) from edu001 e where e.zt_code in ('001','007','006') and nj = ?1 and xb = ?2",nativeQuery = true)
	Long findAllStudentByNj(String nj,String xb);
}
