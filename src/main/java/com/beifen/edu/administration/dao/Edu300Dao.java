package com.beifen.edu.administration.dao;

import java.util.List;

import com.beifen.edu.administration.domian.Edu201;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu300;

public interface Edu300Dao extends JpaRepository<Edu300, Long>, JpaSpecificationExecutor<Edu300> {
	// 查询培养计划下的行政班
	@Query(value = "select * from edu300 e where pyccbm =?1 and xbbm=?2 and njbm =?3 and zybm=?4", nativeQuery = true)
	List<Edu300> queryCulturePlanAdministrationClasses(String levelCode, String departmentCode, String gradeCode,String majorCode);

	// 根据id删除行政班
	@Transactional
	@Modifying
	@Query(value = "delete from edu300 where Edu300_ID =?1", nativeQuery = true)
	void removeAdministrationClass(String edu300id);
	
	// 根据id查询行政班
	@Query(value = "select * from edu300 where Edu300_ID =?1", nativeQuery = true)
	List<Edu300> queryXzbByEdu300ID(String edu300_ID);
	
	//根据300名称查询300id
	@Query(value = "select e.Edu300_ID from edu300 e where e.xzbmc =?1", nativeQuery = true)
	Object queryEdu300IdByEdu300Name(String edu300Name);
	

	// 生成开课计划时修改行政班的开课计划属性
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu300 SET sfsckkjh =?2 WHERE Edu300_ID =?1", nativeQuery = true)
	void generatAdministrationCoursePlan(String edu300Id, String isGeneratCoursePlan);

	// 根据行政班id查询行政班在校人数
	@Query(value = "select e.zxrs from edu300 e where Edu300_ID =?1", nativeQuery = true)
	int queryZXRS(String xzbcode);
	
	// 根据行政班id查询行政班容纳人数
	@Query(value = "select e.rnrs from edu300 e where Edu300_ID =?1", nativeQuery = true)
	int countXzbStudentsById(String deleteEdu300Id);

	// 查询行政班容纳人数人数
	@Query(value = "select e.rnrs from edu300 e where Edu300_ID =?1", nativeQuery = true)
	int queryXZBrnrs(String edu300_ID);

	// 新增学生是改变行政班在校人数
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu300 SET zxrs =?2 WHERE Edu300_ID =?1", nativeQuery = true)
	public void changeAdministrationClassesZXRS(String xzbcode, int newZXRS);

	// 判断导入学生的培养计划和行政班是否对应
	@Query(value = "select * from edu300 e where e.Edu300_ID=?1 and e.pyccbm=?2 and e.xbbm=?3 and njbm=?4 and zybm=?5", nativeQuery = true)
	public List<Edu300> classMatchCultruePaln(String edu300_ID, String pycc, String szxb, String nj, String zybm);

	// 根据id查询行政班
	@Query(value = "select * from edu300 where Edu300_ID =?1", nativeQuery = true)
	Edu300 findXzbByEdu300ID(String bhxzbid);

	// 根据专业查询行政班
	@Query(value = "select * from edu300 where zybm =?1", nativeQuery = true)
    List<Edu300> findClassByMajor(String zybm);

	@Transactional
	@Modifying
	@Query(value = "UPDATE edu300 SET zxrs = zxrs - 1 WHERE Edu300_ID =?1", nativeQuery = true)
	void ZxrsMinusOne(String edu300_id);

	//教学任务书查询行政班
	@Query(value = "select e.* from edu300 e where e.xbbm in ?1", nativeQuery = true)
    List<Edu300> findAdministrativeClassForTask(List<String> departments);

	//根据学院id查询行政班id
	@Query(value = "select cast(e.edu300_id as varchar(100)) aaa from edu300 e where e.xbbm = ?1", nativeQuery = true)
	List<String> selectClass(String departments);

	// 根据行政班id集合查询行政班在校人数
	@Query(value = "select sum(e.zxrs) from edu300 e where Edu300_ID  in ?1", nativeQuery = true)
	int queryZXRSByEdu300Ids(String[] xzbcode);

	// 根据行政班id集合查询行政班
	@Query(value = "select * from edu300 e where Edu300_ID  in ?1", nativeQuery = true)
	List<Edu300> findAllByEdu300Ids(String[] xzbcode);

	//根据专业查询行政班数量
	@Query(value = "select count(e.Edu300_ID) from edu300 e where e.zybm = ?1", nativeQuery = true)
    Integer countByEdu106Id(Long edu106_id);

	//根据权限查询行政班
	@Query(value = "select * from edu300 e where e.xbbm in ?1 order by e.xbbm,e.zybm", nativeQuery = true)
    List<Edu300> findAllbyDepartments(List<String> departments);

	//查询行政班数量
	@Query(value = "select count(0) from edu300 e", nativeQuery = true)
    Long findAllClass();

	@Query(value = "select * from Edu300 e where e.edu300_ID <> ?1 and e.xzbmc = ?2",nativeQuery = true)
    List<Edu300> checkClassRepeat(Long edu300_id, String xzbmc);


	@Query(value = "select * from EDU300 where EDU300_ID in (select EDU300_ID from edu005 where EDU201_ID in (select distinct e.Edu201_ID from edu205 e where e.Edu101_ID = ?1)  GROUP BY EDU300_ID)", nativeQuery = true)
	List<Edu300> searchclassByID(String edu101Id);

	@Query(value = "\n" +
			"select * from EDU300 where EDU300_ID in (select EDU300_ID from edu005 where EDU201_ID in (select distinct e.Edu201_ID from edu205 e where e.Edu101_ID = ?1) and xnid = ?2 and COURSE_NAME in ?3 GROUP BY EDU300_ID)", nativeQuery = true)
	List<Edu300> searchAdministrationClassGradeModelMakeUp(String edu101Id,String trem,List<String> couserName);


	@Query(value = "select * from (SELECT a.*,row_number ( ) over ( partition BY a.zybm,a.batch,njbm ORDER BY a.zybm,a.batch,njbm ) su FROM EDU300 a ) where su = 1 ORDER BY njmc,batch",nativeQuery = true)
	List<Edu300> findAllGroupByZybm();

	@Query(value = "select edu300_id from edu300 where njbm = ?1 and zybm = ?2 and batch = ?3",nativeQuery = true)
	List<Long> findAllByZybm(String njbm,String xx,String yy);

	@Query(value = "select * from edu300 where xbbm = ?1 order by xbbm,zybm,njmc,batch",nativeQuery = true)
	List<Edu300> queryStudentReport(String xbbm);

	@Query(value = "select * from edu300 where xbbm = ?1 and njbm = ?2 order by xbbm,zybm,njmc,batch",nativeQuery = true)
	List<Edu300> queryStudentReport(String xbbm,String njbm);

	@Query(value = "select * from edu300 where xbbm = ?1 and njbm = ?2 and batch = ?3 order by xbbm,zybm,njmc,batch",nativeQuery = true)
	List<Edu300> queryStudentReport(String xbbm,String njbm,String batch);

	@Query(value = "select zybm from edu300 where njbm = ?1 GROUP BY zybm",nativeQuery = true)
	List<String> findAllZy(String njbm);

	@Query(value = "select count(*) from (\n" +
			"select EDU001_ID,count(*) from (\n" +
			"select * from edu005 where EDU300_ID in (select EDU300_ID from edu300 where zybm = ?1 and njbm = ?2) and xnid = ?3) GROUP BY EDU001_ID)",nativeQuery = true)
	String findPeopleNum0(String zybm,String njbm,String xnid);

	@Query(value = "select sum(ZXRS) from edu300 where zybm = ?1 and njbm = ?2 and batch = ?3",nativeQuery = true)
	String findPeopleNum(String zybm,String njbm,String batch);

	@Query(value = "select * from edu300 where edu300_Id in (select edu300_id from edu1071 where edu107_id = ?1)",nativeQuery = true)
	List<Edu300> queryCulturePlanClass(Long edu107Id);

	@Query(value = "select edu300_Id from edu300 where zybm = ?1 and njbm = ?2 and batch = ?3",nativeQuery = true)
	List<String> findAllids(String zy,String nj,String pc);

	@Query(value = "select edu300_Id from edu300 where zybm = ?2 and njbm = ?1 and batch = ?3",nativeQuery = true)
	List<Long> findAllidss(String nj,String zy,String pc);

	@Query(value = "select edu300_Id from edu300 where zybm = ?1 and njbm = ?2",nativeQuery = true)
	List<String> findAllids(String zy,String nj);

	@Query(value = "select * from edu300 where EDU300_ID in ?1 and EDU300_ID not in (select EDU300_ID from edu201 e LEFT JOIN edu204 ee on e.EDU201_ID = ee.EDU201_ID where kcmc = ?2 and xnid = ?3)",nativeQuery = true)
	List<Edu300> queryNotPutedTasksClass(List<Long> classIdList,String kcmc,String xnid);

	@Query(value = "select * from edu300 where zybm = ?1 and njbm = ?2 and batch = ?3 and EDU300_ID not in ?4",nativeQuery = true)
	List<Edu300> findAllNotInList(String zybm,String njbm,String batch,List<Long> classIdList);

	@Query(value = "select * from edu300 where zybm = ?1 and njbm = ?2 and batch = ?3 and EDU300_ID not in ?4 and xzbmc like %?5%",nativeQuery = true)
	List<Edu300> findAllNotInList(String zybm,String njbm,String batch,List<Long> classIdList,String name);

	@Query(value = "select * from edu300 where zybm = ?1 and njbm = ?2 and batch = ?3",nativeQuery = true)
	List<Edu300> findAllList(String zybm,String njbm,String batch);

	@Query(value = "select * from edu300 where zybm = ?1 and njbm = ?2 and batch = ?3 and xzbmc like %?4%",nativeQuery = true)
	List<Edu300> findAllList(String zybm,String njbm,String batch,String name);

	@Query(value = "select * FROM(SELECT a.*,row_number ( ) over ( partition BY njbm,njmc,batch,batch_name ORDER BY njbm,njmc,batch,batch_name ) su FROM edu300 a) e where e.su = 1 order by njmc,batch",nativeQuery = true)
	List<Edu300> findAllXSLX();

	@Query(value = "select case when sum(e.zxrs) is null then 0 else sum(e.zxrs) end from edu300 e where njbm = ?1 and batch = ?2 and zybm = ?3", nativeQuery = true)
	int findStudentCount(String njbm,String batch,String edu106);
}
