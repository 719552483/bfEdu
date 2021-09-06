package com.beifen.edu.administration.dao;

import java.util.List;

import javax.transaction.Transactional;

import com.beifen.edu.administration.domian.Edu108;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu201;

@Configuration
public interface Edu201Dao extends JpaRepository<Edu201, Long>, JpaSpecificationExecutor<Edu201> {
	//根据ID查询任务书
	@Query(value = "select * from edu201 e where e.Edu201_ID=?1", nativeQuery = true)
	public Edu201 queryTaskByID(String iD);


	// 根据教师id 查询教师id为主要老师的任务书
	@Query(value = "select * from edu201 e where e.zyls like %?1%", nativeQuery = true)
	public List<Edu201> queryMainTaskByTeacherID(String teacherId);

	// 根据教师id 查询教师id为老师的任务书
	@Query(value = "select * from edu201 e where e.ls like %?1%", nativeQuery = true)
	public List<Edu201> queryTaskByTeacherID(String teacherId);

	//任务书反馈意见
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET fkyj =?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void chengeTaskFfkyj(String id, String feedBack);

	// 修改任务书状态
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sszt =?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void changeTaskStatus(String id, String status);

	//根据二级学院查询任务书
	@Query(value = "select distinct count(0)\n" +
			"     	from EDU201 r,\n" +
			"            EDU108 p,\n" +
			"            EDU107 q\n" +
			"      where p.EDU107_ID = q.EDU107_ID\n" +
			"        and r.EDU108_ID = p.EDU108_ID\n" +
			"        and q.EDU104 = ?1\n" +
			"        and r.xnid in ?2\n" +
			"and r.sszt='pass'", nativeQuery = true)
	Long getEdu201By104ID(Long edu104Id,List<Long> yearCodeList);

	//根据二级学院查询完成任务书
	@Query(value = "select distinct count(0)\n" +
			"     	from EDU201 r,\n" +
			"            EDU108 p,\n" +
			"            EDU107 q\n" +
			"      where p.EDU107_ID = q.EDU107_ID\n" +
			"        and r.EDU108_ID = p.EDU108_ID\n" +
			"        and q.EDU104 = ?1\n" +
			"        and r.xnid in ?2\n" +
			"and r.SFSQKS = 'T'\n" +
			"and r.sszt='pass'", nativeQuery = true)
	Long getEdu201IsCompleted(Long edu104Id,List<Long> yearCodeList);

	//根据201ID查询任务书
	@Query(value = "select * from edu201 e where e.Edu201_ID=?1", nativeQuery = true)
	Edu201 getTaskById(String edu108id);

	//审批结束后回写状态
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sszt =?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void updateState(String businessKey, String pass);

	//排课后改变任务是是否已排课
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sfypk ='T' WHERE Edu201_ID =?1", nativeQuery = true)
	void taskPutSchedule(String edu201ID);

	//排课后改变任务是是否已排课
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sfypk = null WHERE Edu201_ID =?1", nativeQuery = true)
	void taskPutScheduleFalse(String edu201ID);

	//根据108ID获取任务书集合
	@Query(value = "select e.* from Edu201 e where e.edu108_ID in ?1 and e.sfypk is null  and e.sszt = 'pass'",nativeQuery = true)
	List<Edu201> queryCulturePlanIds(List<Long> current108s);

	@Query(value = "select e.* from Edu201 e where e.edu108_ID in ?1 and xnid = ?2 and e.sfypk is null  and e.sszt = 'pass'",nativeQuery = true)
	List<Edu201> queryCulturePlanIds(List<Long> current108s,String xnid);

	//根据108ID获取任务书集合
	@Query(value = "select e.edu201_id from Edu201 e where e.edu108_ID in ?1 AND SFSQKS = 'T' and xnid = ?2",nativeQuery = true)
	List<Long> queryCulturePlanIdsNew(List<Long> current108s,String xnid);

	//根据108ID获取任务书集合
	@Query(value = "select e.ls from Edu201 e where e.edu108_ID in ?1 and e.sfypk = 'T'  and e.sszt = 'pass' GROUP BY ls",nativeQuery = true)
	List<String> queryCoursePlanIds(List<Long> current108s);

	@Query(value = "select e.Edu201_ID from Edu201 e where e.edu108_ID in ?1 and e.sfypk = 'T'  and e.sszt = 'pass' and xnid = ?2",nativeQuery = true)
	List<String> queryCoursePlanIdsNew(List<Long> current108s,String xnid);

	//根据权限获已发布的教学任务书
	@Query(value = "select a.* from edu201 a,edu108 b,edu107 c " +
			"where a.EDU108_ID = b.EDU108_ID " +
			"and b.EDU107_ID = c.EDU107_ID " +
			"and a.sffbjxrws = 'T' " +
			"and c.EDU104 in ?1 ", nativeQuery = true)
	List<Edu201> findPutedTaskInfoByDepartments(List<String> departments);


	//检查教学班是否被使用
	@Query(value = "select e.class_id from Edu201 e where e.class_id in ?1",nativeQuery = true)
	List<Long> checkTeachingClassInTask(List<String> classIdList);


	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sffbjxrws = ?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void updateRwsState(String edu201id, String f);


	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET sfsqks = ?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void changeTestStatus(String s, String testFlag);

	@Modifying
	@Transactional
	@Query(value = "UPDATE edu201 SET jksj = ?2 WHERE Edu201_ID =?1", nativeQuery = true)
	void changeTestStatusTime(String s, String testFlagTime);

	//根据108ID集合查询任务书
	@Query(value = "select distinct e.Edu201_ID from edu201 e where e.Edu108_ID in ?1 and e.sszt='pass' and e.sfsqks = 'T'", nativeQuery = true)
	List<String> getTaskByEdu108Ids(List<Long> edu108ids);

	//查询任务书是否存在
	@Query(value = "select * from edu201 e where e.kcmc = ?1 and e.class_id = ?2 and e.ls = ?3 and e.zyls = ?4", nativeQuery = true)
	List<Edu201> findExistTask(String kcmc, Long classId, String ls, String zyls);

	@Query(value = "select * from edu201 e where e.kcmc = ?1 and e.class_id = ?2 and e.ls = ?3 and e.zyls is null", nativeQuery = true)
	List<Edu201> findExistTaskWithOutZyls(String kcmc, Long classId, String ls);

	@Query(value = "select distinct t.xnid from Edu201 t")
	List<String> getYearList();

	@Query(value = "select c.* from edu204 a, edu202 b,edu201 c\n" +
			"where a.EDU201_ID = b.EDU201_ID\n" +
			"and c.EDU201_ID = b.EDU201_ID\n" +
			"and a.EDU300_ID = ?1", nativeQuery = true)
	List<Edu201> findTaskWithNewClass(String edu300_id);

	// 根据班级查询学科
	@org.springframework.transaction.annotation.Transactional
	@Modifying(clearAutomatically = true)
//	@Query(value = "select * from Edu201 where class_id = ?1 and xnid = ?2 and sfypk='T' and sfsqks = 'T'", nativeQuery = true)
	@Query(value = "select * from edu201 where edu201_id in (select edu201_id from edu204 where edu300_id = ?1) and xnid = ?2 and sfypk='T' and sfsqks = 'T'", nativeQuery = true)
	List<Edu201> searchCourseByClass(String edu300_ID, String trem);

	// 根据班级查询学科
	@org.springframework.transaction.annotation.Transactional
	@Modifying(clearAutomatically = true)
	@Query(value = "select * from Edu201 where class_id in (select edu301_id from EDU301 t where bhxzbid like %?1%) and xnid = ?2 and sfypk='T' and sfsqks = 'T'", nativeQuery = true)
	List<Edu201> searchCourseByClass2(String edu300_ID, String trem);


	//学生查询任务书id
	@Query(value = "select EDU201_ID from EDU201 where CLASS_ID in ?1 and xnid = ?2 and sfypk = 'T'",nativeQuery = true)
	List<String> findEdu201IdsByclassIds(String[] classIds, String semester);

	@org.springframework.transaction.annotation.Transactional
	@Modifying(clearAutomatically = true)
	@Query(value = "select  * from(select a.*,row_number() over(partition by a.kcmc order by a.kcmc) su from Edu201 a where xnid = ?1 and sfypk='T') where su = 1", nativeQuery = true)
	List<Edu201> searchCourseByXN(String trem);

	@org.springframework.transaction.annotation.Transactional
	@Modifying(clearAutomatically = true)
	@Query(value = "select  * from(select a.*,row_number() over(partition by a.kcmc order by a.kcmc) su from Edu201 a where xnid = ?1 and sfypk='T' and kcmc in (select COURSE_NAME from edu005 where EDU201_ID in (select distinct e.Edu201_ID from edu205 e where e.Edu101_ID = ?2) GROUP BY COURSE_NAME) ) where su = 1", nativeQuery = true)
	List<Edu201> searchCourseByXNAndID(String trem,String edu101Id);

	@Query(value = "select e.edu201_id,e.xn,e.CLASS_NAME,e.kcmc,e.ls from edu201 e LEFT JOIN(select EDU201_ID,CLASS_NAME,COURSE_NAME from edu005 where EDU201_ID  = ?1 GROUP BY CLASS_NAME,COURSE_NAME,EDU201_ID) a on e.EDU201_ID = a.EDU201_ID where e.EDU201_ID  = ?1", nativeQuery = true)
	List<Edu201> searchClassInfo(String edu201);

	@Query(value = "select kcmc from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and xnid = ?2 GROUP BY kcmc", nativeQuery = true)
	List<String> searchCourseNamebyEdu107(Long EDU107_ID,String xnid);

	@Query(value = "select EDU201_ID from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and xnid = ?2 and kcmc = ?3", nativeQuery = true)
	List<String> searchEdu201idsbyEdu107AndKcmc(Long EDU107_ID,String xnid,String courseName);

	@Query(value = "select * from edu201 where EDU108_ID = ?1", nativeQuery = true)
	List<Edu201> findEdu201IdsByedu108id(String edu108_id);

	@Query(value = "select count(0) from(select kcmc from edu201 where xnid = ?1 group by kcmc)", nativeQuery = true)
	String findskmsByxnid(String xnid);
}
