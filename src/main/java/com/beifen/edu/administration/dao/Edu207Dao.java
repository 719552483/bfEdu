package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu207;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu207Dao extends JpaRepository<Edu207, Long>, JpaSpecificationExecutor<Edu207> {

    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu207 where Edu201_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String edu201Id);

    //根据edu201ID查询分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID = ?1 order by to_number(week)", nativeQuery = true)
    List<Edu207> findAllByEdu201Id(String edu201Id);

    //根据edu201ID集合查询分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID in ?1 and e.week = ?2 order by to_number(week)", nativeQuery = true)
    List<Edu207> findAllByEdu201Ids(List<String> edu201Ids,String week);

    //根据edu201ID和周数查询分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID = ?1 and e.week = ?2 order by to_number(week)", nativeQuery = true)
    List<Edu207> findAllByEdu201IdAndWeek(String edu201Id,String week);

    //根据edu201ID集合查询学年分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID in ?1 order by to_number(week)", nativeQuery = true)
    List<Edu207> findAllByEdu201IdsWithoutWeek(List<String> edu201Ids);

    //根据edu101ID查询学年分散学识安排
    @Query(value = "SELECT ee.* FROM EDU207 ee LEFT JOIN EDU201 e on ee.EDU201_ID = e.EDU201_ID where ee.edu101_id = ?1 and e.xnid = ?2 order by to_number(ee.week)", nativeQuery = true)
    List<Edu207> findAllByEdu101IdWithoutWeek(String edu101id,String xnid);

    //根据edu201ID集合查询学年分散学识安排
    @Query(value = "select sum(CLASS_HOURS) from EDU207 where EDU201_ID = ?1", nativeQuery = true)
    Long findFsxsSumByEdu201Id(String EDU201_ID);

    //根据二级学院获取分散学时总数
    @Query(value = "select sum(CLASS_HOURS)\n" +
            "    from (select distinct b.EDU104_ID, b.XBMC \n" +
            "        from edu107 a, \n" +
            "        edu104 b \n" +
            "        where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?3 and a.edu105 in ?2) m,\n" +
            "        EDU207 n,\n" +
            "        EDU201 r, \n" +
            "        edu202 o, \n" +
            "        EDU108 p, \n" +
            "        EDU107 q \n" +
            "    where n.EDU201_ID = r.EDU201_ID\n" +
            "      and o.EDU201_ID = r.EDU201_ID \n" +
            "      and p.EDU107_ID = q.EDU107_ID \n" +
            "      and r.EDU108_ID = p.EDU108_ID \n" +
            "      and m.EDU104_ID = q.EDU104 \n" +
            "  and r.xnid = ?4",nativeQuery = true)
    Long getFsksClassPeriod(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,Long yearCode);


    @Query(value = "select sum(CLASS_HOURS)\n" +
            "    from (select distinct b.EDU104_ID, b.XBMC \n" +
            "        from edu107 a, \n" +
            "        edu104 b \n" +
            "        where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?4 and a.edu105 in ?3) m,\n" +
            "        EDU207 n,\n" +
            "        EDU201 r, \n" +
            "        edu202 o, \n" +
            "        EDU108 p, \n" +
            "        EDU107 q \n" +
            "    where n.EDU201_ID = r.EDU201_ID\n" +
            "      and o.EDU201_ID = r.EDU201_ID \n" +
            "      and p.EDU107_ID = q.EDU107_ID \n" +
            "      and r.EDU108_ID = p.EDU108_ID \n" +
            "      and m.EDU104_ID = q.EDU104 \n" +
            "      and r.xnid = ?5" +
            "      and to_number(n.week) < ?2",nativeQuery = true)
    Long getFsksClassPeriodComplete(String departmentCode, int week,List<Long> schoolYearCodeList,List<String> batchCodeList,Long yearCode);

    @Query(value = "select sum(CLASS_HOURS)\n" +
            "    from (select distinct b.EDU104_ID, b.XBMC \n" +
            "        from edu107 a, \n" +
            "        edu104 b \n" +
            "        where a.EDU104 = b.EDU104_ID) m,\n" +
            "        EDU207 n,\n" +
            "        EDU201 r, \n" +
            "        edu202 o, \n" +
            "        EDU108 p, \n" +
            "        EDU107 q \n" +
            "    where n.EDU201_ID = r.EDU201_ID\n" +
            "      and o.EDU201_ID = r.EDU201_ID \n" +
            "      and p.EDU107_ID = q.EDU107_ID \n" +
            "      and r.EDU108_ID = p.EDU108_ID \n" +
            "      and m.EDU104_ID = q.EDU104 \n" +
            "      and r.xnid = ?2" +
            "      and to_number(n.week) < ?1",nativeQuery = true)
    Long getFsksClassPeriodCompleted(int week,String edu400ID);


    @Query(value = "select sum(CLASS_HOURS) from EDU207 where Edu201_ID in (select edu201_id from edu201 where EDU201_ID in (select e.Edu201_ID from edu204 e where e.Edu300_ID =?1) and xnid = ?2)  and week = ?3 ", nativeQuery = true)
    Integer comfirmScheduleFSCheck(String classId,String xnid,String week);
}
