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
    @Query(value = "select  * from(select a.*,row_number() over(partition by a.jsz,a.ksz,a.xqid,a.kjid order by a.edu202_ID) su from Edu203 a where edu202_ID = ?1) where su = 1", nativeQuery = true)
    List<Edu203> getClassPeriodByEdu202IdDist(String edu202Id);

    //根据课程id查询课节
    @Query(value = "select * from Edu203 where edu202_ID = ?1", nativeQuery = true)
    List<Edu203> getClassPeriodByEdu202Id(String edu202Id);

    @Query(value = "SELECT e.* FROM EDU203 e left join edu202 ee on e.EDU202_ID = ee.EDU202_ID where ee.xnid = ?2 and e.POINT_ID = ?1 ", nativeQuery = true)
    List<Edu203> findEdu203IdsByEdu501Id(String toString,String xnid);

    @Query(value = "SELECT count(*) FROM EDU203 where POINT_ID = ?1 ", nativeQuery = true)
    Integer findEdu203CountByEdu501Id(String toString);

    @Query(value = "SELECT count(*) FROM EDU203 e left join edu202 ee on e.EDU202_ID = ee.EDU202_ID where ee.xnid = ?1 ", nativeQuery = true)
    Integer findEdu203IdsByxnid(String xnid);

    @Query(value = "SELECT count(*) FROM EDU203", nativeQuery = true)
    Integer findEdu203Count();



    //根据学院查询集中课时数量
    @Query(value = "select count(0)\n" +
            "from (select distinct b.EDU104_ID, b.XBMC\n" +
            "    from edu107 a,\n" +
            "    edu104 b\n" +
            "    where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?3 and a.edu105 in ?2) m,\n" +
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
            "  and n.TEACHER_TYPE = '01'" +
            "  and r.xnid = ?4",nativeQuery = true)
    Long getJzksClassPeriod(String departmentCode,List<Long> schoolYearCodeList,List<String> batchCodeList,Long yearCode);

    //根据学院查询集中课时完成数量
    @Query(value = "select count(1) \n" +
            "    from (select distinct b.EDU104_ID, b.XBMC \n" +
            "        from edu107 a, \n" +
            "        edu104 b \n" +
            "        where a.EDU104 = b.EDU104_ID and a.EDU104 = ?1 and a.batch in ?5 and a.edu105 in ?4) m,\n" +
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
            "      and r.xnid = ?6" +
            "      and (to_number(n.week) < ?2 or (to_number(n.week) = ?2 and to_number(n.xqid) < ?3))",nativeQuery = true)
    Long getJzksClassPeriodComplete(String departmentCode, int week, int dayOfWeek, List<Long> schoolYearCodeList,List<String> batchCodeList,Long yearCode);

    //查询集中课时完成数量
    @Query(value = "select count(1) \n" +
            "    from (select distinct b.EDU104_ID, b.XBMC \n" +
            "        from edu107 a, \n" +
            "        edu104 b \n" +
            "        where a.EDU104 = b.EDU104_ID) m,\n" +
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
            "      and r.xnid = ?3" +
            "      and (to_number(n.week) < ?1 or (to_number(n.week) = ?1 and to_number(n.xqid) < ?2))",nativeQuery = true)
    Long getJzksClassPeriodCompleted(int week, int dayOfWeek,String edu401ID);


    //更新出勤率
    @Transactional
    @Modifying
    @Query(value = "update edu203 t set t.attendance = ?2 where t.Edu203_ID =?1", nativeQuery = true)
    void updateAttendance(String edu203_id, String usedPercent);

    //查询开始周大于调课的
    @Transactional
    @Modifying
    @Query(value = "select * from EDU203 where EDU202_ID = ?1 and ksz <= ?2 and jsz >= ?2 and kjid = ?3 and xqid = ?4 and week >?2", nativeQuery = true)
    List<Edu203> thanClasses(String edu202_id,String week,String kjid,String xqid);

    //查询开始周小于调课的
    @Transactional
    @Modifying
    @Query(value = "select * from EDU203 where EDU202_ID = ?1 and ksz <= ?2 and jsz >= ?2 and kjid = ?3 and xqid = ?4 and week <?2", nativeQuery = true)
    List<Edu203> lessClasses(String edu202_id,String week,String kjid,String xqid);


    //更新教学任务点名称
    @Transactional
    @Modifying
    @Query(value = "update edu203 t set t.POINT_NAME = ?2 where t.POINT_ID =?1", nativeQuery = true)
    void updatePointName(Long edu501_id, String POINT_NAME);


    //更新教学点名称
    @Transactional
    @Modifying
    @Query(value = "update edu203 t set t.LOCAL_NAME = ?2 where t.LOCAL_ID =?1", nativeQuery = true)
    void updateLocalName(Long edu500_id, String local_NAME);

    //查询排课数量
    // select count(*) from edu203 where EDU202_ID in (select EDU202_ID from EDU202 where EDU201_ID in (select EDU201_ID from edu201 where EDU201_ID in (select EDU201_ID from edu204 where EDU300_ID = '9045'))) and week = 1
    @Query(value = "select count(*) from edu203 where EDU202_ID in (select EDU202_ID from EDU202 where EDU201_ID in (select EDU201_ID from edu201 where EDU201_ID in (select EDU201_ID from edu204 where EDU300_ID = ?1))) and week = ?2", nativeQuery = true)
    String getPKcount(String classId,String szz);
}
