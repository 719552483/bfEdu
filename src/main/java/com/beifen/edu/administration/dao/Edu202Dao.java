package com.beifen.edu.administration.dao;

import java.util.List;

import com.beifen.edu.administration.PO.BigDataDepartmentPO;
import com.beifen.edu.administration.PO.StudentInPointPO;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu202;

import javax.transaction.Transactional;

@Configuration
public interface Edu202Dao extends JpaRepository<Edu202, Long>, JpaSpecificationExecutor<Edu202> {

	// 验证是否有排课表正在使用课节Id
	@Query(value = "select * from edu202 e where e.kjid like %?1%", nativeQuery = true)
	List<Edu202> verifyKj(String kjId);

	//根据ID查询排课信息
	@Query(value = "select * from edu202 e where e.Edu202_ID = ?1", nativeQuery = true)
	Edu202 findEdu202ById(String edu202Id);

	@Query(value = "select e.Edu202_ID from Edu202 e where e.Edu201_ID in ?1", nativeQuery = true)
    List<String> findEdu202ByEdu201Ids(List<String> deleteArray);

	@Query(value = "select e.Edu202_ID from Edu202 e where e.Edu201_ID = ?1", nativeQuery = true)
    List<String> findEdu202ByEdu201Ids(String edu201Id);

	//获取二级学院信息
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name, to_char(count(t.XM)) teacher_count\n" +
			"from (select distinct m.EDU104_ID, m.XBMC, s.XM\n" +
			"      from (select distinct b.EDU104_ID, b.XBMC\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID) m,\n" +
			"           EDU203 n,\n" +
			"           EDU201 r,\n" +
			"           EDU101 s,\n" +
			"           edu202 o,\n" +
			"           EDU108 p,\n" +
			"           EDU107 q\n" +
			"      where n.EDU202_ID = o.EDU202_ID\n" +
			"        and o.EDU201_ID = r.EDU201_ID\n" +
			"        and s.EDU101_ID = n.EDU101_ID\n" +
			"        and p.EDU107_ID = q.EDU107_ID\n" +
			"        and r.EDU108_ID = p.EDU108_ID\n" +
			"        and m.EDU104_ID = q.EDU104\n" +
			"        and n.TEACHER_TYPE = '01'\n" +
			"      group by m.EDU104_ID, m.XBMC, s.XM) t\n" +
			"group by t.EDU104_ID, t.XBMC",nativeQuery = true)
	List<Object[]> getDepartment();

	//获取大屏教师类型
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name, to_char(count(t.xm)) teacher_count, to_char(t.JZGLX) teacher_type, to_char(t.JZGLXBM) teacher_type_name\n" +
			"from (select distinct m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM\n" +
			"      from (select distinct b.EDU104_ID, b.XBMC\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID) m,\n" +
			"           EDU203 n,\n" +
			"           EDU201 r,\n" +
			"           EDU101 s,\n" +
			"           edu202 o,\n" +
			"           EDU108 p,\n" +
			"           EDU107 q\n" +
			"      where n.EDU202_ID = o.EDU202_ID\n" +
			"        and o.EDU201_ID = r.EDU201_ID\n" +
			"        and s.EDU101_ID = n.EDU101_ID\n" +
			"        and p.EDU107_ID = q.EDU107_ID\n" +
			"        and r.EDU108_ID = p.EDU108_ID\n" +
			"        and m.EDU104_ID = q.EDU104\n" +
			"        and n.TEACHER_TYPE = '01'\n" +
			"      group by m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM) t\n" +
			"group by t.EDU104_ID, t.XBMC, t.JZGLX, t.JZGLXBM\n" +
			"order by t.EDU104_ID, t.JZGLX",nativeQuery = true)
	List<Object[]> getTeacherType();


	//获取大屏课时类型
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name,to_char(sum(t.zxs)) zxs,to_char(sum(t.llxs)) llxs,to_char(sum(t.sjxs)) sjxs,to_char(sum(t.jzxs)) jzxs,to_char(sum(t.fsxs)) fsxs\n" +
			"from (select distinct n.EDU202_ID,m.EDU104_ID, m.XBMC,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS\n" +
			"      from (select distinct b.EDU104_ID, b.XBMC\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID) m,\n" +
			"           EDU203 n,\n" +
			"           EDU201 r,\n" +
			"           edu202 o,\n" +
			"           EDU108 p,\n" +
			"           EDU107 q\n" +
			"      where n.EDU202_ID = o.EDU202_ID\n" +
			"        and o.EDU201_ID = r.EDU201_ID\n" +
			"        and p.EDU107_ID = q.EDU107_ID\n" +
			"        and r.EDU108_ID = p.EDU108_ID\n" +
			"        and m.EDU104_ID = q.EDU104\n" +
			"        and n.TEACHER_TYPE = '01'\n" +
			"      group by m.EDU104_ID, m.XBMC,n.EDU202_ID,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS) t\n" +
			"group by t.EDU104_ID, t.XBMC " +
			"order by t.EDU104_ID ",nativeQuery = true)
	List<Object[]> getPeriodType();

	@Query(value = "select to_char(t.LOCAL_ID) edu501_id,to_char(t.LOCAL_NAME) local_name,to_char(sum(t.zxrs)) student_count from (select e.LOCAL_ID,e.LOCAL_NAME,c.zxrs,c.EDU300_ID from Edu201 a,Edu202 b, Edu204 d,Edu300 c, Edu203 e\n" +
			"               where c.edu300_ID = d.edu300_ID\n" +
			"                 and b.edu202_ID = e.edu202_ID\n" +
			"                 and d.EDU201_ID = a.EDU201_ID\n" +
			"                 and a.EDU201_ID = b.EDU201_ID\n" +
			"                 and e.LOCAL_ID is not null\n" +
			"                 and e.LOCAL_ID <> '57250'\n" +
			"               group by e.LOCAL_ID,e.LOCAL_NAME,c.zxrs,c.EDU300_ID\n" +
			"               order by e.LOCAL_ID) t\n" +
			"group by t.LOCAL_ID,t.LOCAL_NAME",nativeQuery = true)
	List<Object[]> getStudentsInLocal();
}
