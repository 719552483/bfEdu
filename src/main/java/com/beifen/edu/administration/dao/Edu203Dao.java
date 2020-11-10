package com.beifen.edu.administration.dao;


import com.beifen.edu.administration.domian.Edu203;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu203Dao extends JpaRepository<Edu203, Long>, JpaSpecificationExecutor<Edu203> {

    //根据课程id查询排课细节
    @Query(value = "select * from Edu203 where edu202_ID in ?1", nativeQuery = true)
    List<Edu203> findAllbyEdu202Ids(List<String> edu202Ids);

    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu203 where Edu202_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String scheduleId);

    //根据课程id查询课节
    @Query(value = "select * from Edu203 where edu202_ID = ?1", nativeQuery = true)
    List<Edu203> getClassPeriodByEdu202Id(String edu202Id);

    @Query(value = "select * from Edu203 e where e.point_id = ?1", nativeQuery = true)
    List<Edu203> findEdu203IdsByEdu501Id(String toString);

    //根据学院查询集中课时数量
    @Query(value = "select n.*\n" +
            "from (select distinct b.EDU104_ID, b.XBMC\n" +
            "    from edu107 a,\n" +
            "    edu104 b\n" +
            "    where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1) m,\n" +
            "    EDU203 n,\n" +
            "    EDU201 r,\n" +
            "    edu202 o,\n" +
            "    EDU108 p,\n" +
            "    EDU107 q\n" +
            "where n.EDU202_ID = o.EDU202_ID\n" +
            "  and o.EDU201_ID = r.EDU201_ID\n" +
            "  and p.EDU107_ID = q.EDU107_ID\n" +
            "  and r.EDU108_ID = p.EDU108_ID\n" +
            "  and m.EDU104_ID = q.EDU104\n" +
            "  and n.TEACHER_TYPE = '01'",nativeQuery = true)
    List<Edu203> getJzksClassPeriod(String departmentCode);

    //根据学院查询集中课时完成数量
    @Query(value = "select n.* \n" +
            "    from (select distinct b.EDU104_ID, b.XBMC \n" +
            "        from edu107 a, \n" +
            "        edu104 b \n" +
            "        where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1) m,\n" +
            "        EDU203 n, \n" +
            "        EDU201 r, \n" +
            "        edu202 o, \n" +
            "        EDU108 p, \n" +
            "        EDU107 q \n" +
            "    where n.EDU202_ID = o.EDU202_ID \n" +
            "      and o.EDU201_ID = r.EDU201_ID \n" +
            "      and p.EDU107_ID = q.EDU107_ID \n" +
            "      and r.EDU108_ID = p.EDU108_ID \n" +
            "      and m.EDU104_ID = q.EDU104 \n" +
            "      and n.TEACHER_TYPE = '01' \n" +
            "      and (to_number(n.week) < ?2 or (to_number(n.week) = ?2 and to_number(n.xqid) < ?3))",nativeQuery = true)
    List<Edu203> getJzksClassPeriodComplete(String departmentCode, int week, int dayOfWeek);
}
