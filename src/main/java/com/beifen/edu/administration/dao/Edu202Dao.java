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
			"            where a.EDU104 = b.EDU104_ID and a.batch in ?2 and a.edu105 in ?1) m,\n" +
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
			"        and r.xnid in ?3" +
			"      group by m.EDU104_ID, m.XBMC, s.XM) t\n" +
			"group by t.EDU104_ID, t.XBMC",nativeQuery = true)
	List<Object[]> getDepartment(List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList);

	//获取大屏教师类型
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name, to_char(count(t.xm)) teacher_count, to_char(t.JZGLX) teacher_type, to_char(t.JZGLXBM) teacher_type_name\n" +
			"from (select distinct m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM\n" +
			"from (select distinct b.EDU104_ID, b.XBMC\n" +
			"from edu107 a,\n" +
			"edu104 b\n" +
			"where a.EDU104 = b.EDU104_ID and a.batch in ?2 and a.edu105 in ?1 ) m,\n" +
			"EDU203 n,\n" +
			"EDU201 r,\n" +
			"EDU101 s,\n" +
			"edu202 o,\n" +
			"edu204 d,\n" +
			"edu300 f\n" +
			"where n.EDU202_ID = o.EDU202_ID\n" +
			"and o.EDU201_ID = r.EDU201_ID\n" +
			"and s.EDU101_ID = n.EDU101_ID\n" +
			"and d.EDU201_ID = r.EDU201_ID\n" +
			"and f.edu300_id = d.edu300_id\n" +
			"and m.EDU104_ID = f.xbbm\n" +
			"and n.TEACHER_TYPE = '01'\n" +
			"and r.xnid in ?3\n" +
			"group by m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM) t\n" +
			"group by t.EDU104_ID, t.XBMC, t.JZGLX, t.JZGLXBM\n" +
			"order by t.EDU104_ID, t.JZGLX",nativeQuery = true)
	List<Object[]> getTeacherType(List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList
	);


	//获取大屏课时类型
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name,to_char(sum(t.zxs)) zxs,to_char(sum(t.llxs)) llxs,to_char(sum(t.sjxs)) sjxs,to_char(sum(t.jzxs)) jzxs,to_char(sum(t.fsxs)) fsxs\n" +
			"from (select distinct n.EDU202_ID,m.EDU104_ID, m.XBMC,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS\n" +
			"      from (select distinct b.EDU104_ID, b.XBMC\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID and a.batch in ?2 and a.edu105 in ?1) m,\n" +
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
			"        and r.xnid in ?3" +
			"      group by m.EDU104_ID, m.XBMC,n.EDU202_ID,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS) t\n" +
			"group by t.EDU104_ID, t.XBMC " +
			"order by t.EDU104_ID ",nativeQuery = true)
	List<Object[]> getPeriodType(List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList);

	//根据行政班查询教学点学生人数
	@Query(value = "select t.local_code edu501_id,t.local_name local_name,to_char(sum(t.zxrs)) student_count  from Edu300 t where t.njbm in ?1 and t.batch in ?2 group by t.local_code,t.local_name",nativeQuery = true)
	List<Object[]> getStudentsInLocalByEdu300(List<Long> schoolYearCodeList,List<String> batchCodeList);

	//根据行政班查询教学点学生人数
	@Query(value = "select t.local_code edu501_id,t.local_name local_name,to_char(sum(t.zxrs)) student_count  from Edu300 t  group by t.local_code,t.local_name",nativeQuery = true)
	List<Object[]> getStudentsInLocalByEdu300();


	//根据行政班查询教学点学生人数
	@Query(value = "select city city,to_char(sum(t.zxrs)) student_count from edu300 t LEFT JOIN edu500 e on t.local_code =  e.edu500_id GROUP BY city",nativeQuery = true)
	List<Object[]> getStudentsInLocalByEdu300New();

	//根据行政班查询教学点学生人数
	@Query(value = "select t.local_code edu501_id,t.local_name local_name,to_char(sum(t.zxrs)) student_count  from Edu300 t LEFT JOIN edu500 e on t.local_code =  e.edu500_id where e.city = ?1 group by t.local_code,t.local_name",nativeQuery = true)
	List<Object[]> getStudentsInLocalByEdu300NewByCity(String city);


	//根据二级学院获取教师类型
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name, to_char(count(t.xm)) teacher_count, to_char(t.JZGLX) teacher_type, to_char(t.JZGLXBM) teacher_type_name\n" +
			"from (select distinct m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM\n" +
			"from (select distinct b.EDU104_ID, b.XBMC\n" +
			"from edu107 a,\n" +
			"edu104 b\n" +
			"where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?3 and a.edu105 in ?2) m,\n" +
			"EDU203 n,\n" +
			"EDU201 r,\n" +
			"EDU101 s,\n" +
			"edu202 o,\n" +
			"EDU108 p,\n" +
			"EDU107 q\n" +
			"where n.EDU202_ID = o.EDU202_ID\n" +
			"and o.EDU201_ID = r.EDU201_ID\n" +
			"and s.EDU101_ID = n.EDU101_ID\n" +
			"and p.EDU107_ID = q.EDU107_ID\n" +
			"and r.EDU108_ID = p.EDU108_ID\n" +
			"and m.EDU104_ID = q.EDU104\n" +
			"and n.TEACHER_TYPE = '01'\n" +
			"and r.xnid in ?4\n" +
			"group by m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM) t\n" +
			"group by t.EDU104_ID, t.XBMC, t.JZGLX, t.JZGLXBM\n" +
			"order by t.EDU104_ID, t.JZGLX",nativeQuery = true)
	List<Object[]> getTeacherTypeInDepartment(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList);


	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name,to_char(sum(t.zxs)) zxs,to_char(sum(t.llxs)) llxs,to_char(sum(t.sjxs)) sjxs,to_char(sum(t.jzxs)) jzxs,to_char(sum(t.fsxs)) fsxs\n" +
			"from (select distinct n.EDU202_ID,m.EDU104_ID, m.XBMC,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS\n" +
			"      from (select distinct b.EDU104_ID, b.XBMC\n" +
			"            from edu107 a,\n" +
			"                 edu104 b\n" +
			"            where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?3 and a.edu105 in ?2) m,\n" +
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
			"        and r.xnid in ?4" +
			"      group by m.EDU104_ID, m.XBMC,n.EDU202_ID,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS) t\n" +
			"group by t.EDU104_ID, t.XBMC " +
			"order by t.EDU104_ID ",nativeQuery = true)
	List<Object[]> getPeriodTypeInDepartment(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList);

	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name,to_char(sum(t.zxs)) zxs,to_char(sum(t.llxs)) llxs,to_char(sum(t.sjxs)) sjxs,to_char(sum(t.jzxs)) jzxs,to_char(sum(t.fsxs)) fsxs\n" +
			"from (select distinct n.EDU202_ID,m.EDU104_ID, m.XBMC,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS\n" +
			"from (select distinct b.EDU104_ID, b.XBMC\n" +
			"from edu107 a,\n" +
			"edu104 b\n" +
			"where a.EDU104 = b.EDU104_ID ) m,\n" +
			"EDU203 n,\n" +
			"EDU201 r,\n" +
			"edu202 o,\n" +
			"EDU108 p,\n" +
			"EDU107 q\n" +
			"where n.EDU202_ID = o.EDU202_ID\n" +
			"and o.EDU201_ID = r.EDU201_ID\n" +
			"and p.EDU107_ID = q.EDU107_ID\n" +
			"and r.EDU108_ID = p.EDU108_ID\n" +
			"and m.EDU104_ID = q.EDU104\n" +
			"and n.TEACHER_TYPE = '01'\n" +
			"group by m.EDU104_ID, m.XBMC,n.EDU202_ID,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS) t\n" +
			"group by t.EDU104_ID, t.XBMC\n" +
			"order by t.EDU104_ID",nativeQuery = true)
	List<Object[]> getPeriodTypeInDepartment();

	//根据二级学院查询各教学点在校人数
	@Query(value = "select t.local_code edu501_id,t.local_name local_name,to_char(sum(t.zxrs)) student_count from Edu300 t where t.xbbm = ?1 and t.njbm in ?2 and t.batch in ?3 group by t.local_code, t.local_name",nativeQuery = true)
	List<Object[]> getStudentsInLocalByEdu300Only(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList);

	//获取教师职称分布数据
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name, to_char(count(t.xm)) teacher_count, to_char(t.ZCBM) teacher_type, to_char(t.ZC) teacher_type_name\n" +
			"    from (select distinct m.EDU104_ID, m.XBMC, s.XM, s.ZC, s.ZCBM \n" +
			"          from (select distinct b.EDU104_ID, b.XBMC \n" +
			"                from edu107 a, \n" +
			"                     edu104 b \n" +
			"                where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?3 and a.edu105 in ?2) m, \n" +
			"               EDU203 n, \n" +
			"               EDU201 r, \n" +
			"               EDU101 s, \n" +
			"               edu202 o, \n" +
			"               EDU108 p, \n" +
			"               EDU107 q \n" +
			"          where n.EDU202_ID = o.EDU202_ID \n" +
			"            and o.EDU201_ID = r.EDU201_ID \n" +
			"            and s.EDU101_ID = n.EDU101_ID \n" +
			"            and p.EDU107_ID = q.EDU107_ID \n" +
			"            and r.EDU108_ID = p.EDU108_ID \n" +
			"            and m.EDU104_ID = q.EDU104 \n" +
			"            and n.TEACHER_TYPE = '01' \n" +
			"        	 and r.xnid in ?4" +
			"          group by m.EDU104_ID, m.XBMC, s.XM, s.ZC, s.ZCBM) t \n" +
			"    group by t.EDU104_ID, t.XBMC, t.ZC, t.ZCBM \n" +
			"    order by t.EDU104_ID, t.ZC",nativeQuery = true)
	List<Object[]> getTeacherZcType(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList);

	//获取各类型老师集中学时数量
	@Query(value = "select to_char(t.EDU104_ID) edu104_id, to_char(t.XBMC) department_name, to_char(count(t.EDU203_ID)*2) teacher_count, to_char(t.JZGLXBM) teacher_type, to_char(t.JZGLX) teacher_type_name\n" +
			"    from (select distinct m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM,n.EDU203_ID\n" +
			"          from (select distinct b.EDU104_ID, b.XBMC\n" +
			"                from edu107 a,\n" +
			"                     edu104 b\n" +
			"                where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?3 and a.edu105 in ?2) m,\n" +
			"               EDU203 n,\n" +
			"               EDU201 r,\n" +
			"               EDU101 s,\n" +
			"               edu202 o,\n" +
			"               EDU108 p,\n" +
			"               EDU107 q\n" +
			"          where n.EDU202_ID = o.EDU202_ID\n" +
			"            and o.EDU201_ID = r.EDU201_ID\n" +
			"            and s.EDU101_ID = n.EDU101_ID\n" +
			"            and p.EDU107_ID = q.EDU107_ID\n" +
			"            and r.EDU108_ID = p.EDU108_ID\n" +
			"            and m.EDU104_ID = q.EDU104\n" +
			"            and n.TEACHER_TYPE = '01'\n" +
			"        	 and r.xnid in ?4" +
			"          group by m.EDU104_ID, m.XBMC, s.XM, s.JZGLX, s.JZGLXBM,n.EDU203_ID) t\n" +
			"    group by t.EDU104_ID, t.XBMC, t.JZGLX, t.JZGLXBM \n" +
			"    order by t.EDU104_ID, t.JZGLX",nativeQuery = true)
	List<Object[]> getPeriodByTeacherType(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,List<Long> yearCodeList);


	//获取全部课时类型
	@Query(value = "select to_char(sum(t.zxs)) zxs,to_char(sum(t.llxs)) llxs,to_char(sum(t.sjxs)) sjxs,to_char(sum(t.jzxs)) jzxs,to_char(sum(t.fsxs)) fsxs\n" +
			"from (select distinct n.EDU202_ID,m.EDU104_ID, m.XBMC,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS \n" +
			"      from (select distinct b.EDU104_ID, b.XBMC \n" +
			"            from edu107 a, \n" +
			"                 edu104 b \n" +
			"            where a.EDU104 = b.EDU104_ID) m, \n" +
			"           EDU203 n, \n" +
			"           EDU201 r, \n" +
			"           edu202 o, \n" +
			"           EDU108 p, \n" +
			"           EDU107 q \n" +
			"      where n.EDU202_ID = o.EDU202_ID \n" +
			"        and o.EDU201_ID = r.EDU201_ID \n" +
			"        and p.EDU107_ID = q.EDU107_ID \n" +
			"        and r.EDU108_ID = p.EDU108_ID \n" +
			"        and m.EDU104_ID = q.EDU104 \n" +
			"        and n.TEACHER_TYPE = '01' \n" +
			"      group by m.EDU104_ID, m.XBMC,n.EDU202_ID,p.zxs,p.LLXS,p.SJXS,p.JZXS,p.FSXS) t\n",nativeQuery = true)
	List<Object[]> getAllPeriodType();
}
