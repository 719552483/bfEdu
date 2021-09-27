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

    //根据学年查询排课总数量
    @Query(value = "select count(0)*2 from edu203 where EDU202_ID in (select EDU202_ID from EDU202 where xnid = ?1 and EDU201_ID in (select EDU201_ID from edu204 where EDU300_ID in (select EDU300_ID from edu300 where xbbm = ?2)))", nativeQuery = true)
    String getPKcount(String xnid,String xbbm);

    //根据学年查询已上课总数量
    @Query(value = "select count(0)*2 from edu203 where EDU202_ID in (select EDU202_ID from EDU202 where xnid = ?1 and EDU201_ID in (select EDU201_ID from edu204 where EDU300_ID in (select EDU300_ID from edu300 where xbbm = ?2))) and (week < ?3 or (week = ?3 and xqid < ?4))", nativeQuery = true)
    String getPKcount2(String xnid,String xbbm,int week,String xqid);

    //根据学年查询已上课总数量
    @Query(value = "select count(*)*2 from edu203 e LEFT JOIN edu202 ee on e.EDU202_ID = ee.EDU202_ID where  week < ?2 or (week = ?2 and xqid < ?3) and ee.xnid = ?1", nativeQuery = true)
    String getPKcount3(String xnid,int week,String xqid);

    @Query(value = "select count(*)*2 from (select edu101_id,week,xqid,kjid from edu203 e LEFT JOIN edu202 ee on e.EDU202_ID = ee.EDU202_ID where ee.xnid = ?1 and ee.EDU201_ID in (select DISTINCT EDU201_ID from edu204 where edu300_id in  (select edu300_id from edu300 where zybm = ?4)) and  (week < ?2 or (week = ?2 and xqid < ?3)) GROUP BY edu101_id,week,xqid,kjid)", nativeQuery = true)
    String getPKcount4(String xnid,int week,String xqid,String zybm);

    @Query(value = "select count(0) from(select count(0) from (select e.* from edu203 e left join edu101 ee on e.EDU101_ID = ee.EDU101_ID left join edu202 eee on e.EDU202_ID = eee.EDU202_ID where ee.JZGLXBM = ?2 and xnid = ?1) GROUP BY EDU101_ID)", nativeQuery = true)
    String getjsslByXnAndLx(String xnid,String lx);

    @Query(value = "select count(0) from(\n" +
            "select count(0) from (\n" +
            "select e.* from EDU203 e\n" +
            "left join edu101 ee on e.EDU101_ID = ee.EDU101_ID \n" +
            "where EDU202_ID in (\n" +
            "select EDU202_ID from EDU202 where EDU201_ID in (\n" +
            "select DISTINCT EDU201_ID from edu204 where edu300_id in  (\n" +
            "select edu300_id from edu300 where zybm = ?1)) and xnid = ?2) and ee.JZGLXBM = ?3\n" +
            ")\n" +
            "GROUP BY EDU101_ID\n" +
            ")", nativeQuery = true)
    String getjsslByXnAndLx2(String zybm,String xnid,String lx);

    @Query(value = "select count(0)*2 from (select edu101_id,week,xqid,kjid from edu203 where edu202_id in (select edu202_id from edu202 where xnid = ?1) group by edu101_id,week,xqid,kjid)", nativeQuery = true)
    String getzxsByXnid(String xnid);

    @Query(value = "select count(0)*2 from (select edu101_id,week,xqid,kjid from edu203 where edu202_id in (select edu202_id from edu202 where xnid = ?2 and EDU201_ID in (select DISTINCT EDU201_ID from edu204 where edu300_id in  (select edu300_id from edu300 where zybm = ?1))) group by edu101_id,week,xqid,kjid)", nativeQuery = true)
    String getzxsByXnid2(String edu106,String xnid);

    @Transactional
    @Modifying
    @Query(value = "update (select t.* from edu203 t LEFT JOIN edu202 e on t.EDU202_ID = e.EDU202_ID where e.xnid = ?1 and t.xqid = ?3 and week = ?2) set CLOSED_STATE = '1'", nativeQuery = true)
    void closedScheduleTeacher(String xnid,String week,String xqid);

    @Transactional
    @Modifying
    @Query(value = "update (\n" +
            "select t.* from edu203 t \n" +
            "LEFT JOIN edu202 e on t.EDU202_ID = e.EDU202_ID\n" +
            "left join edu201 ee on e.edu201_id = ee. edu201_id\n" +
            "left join edu108 eee on ee.EDU108_ID = eee.EDU108_ID\n" +
            "LEFT JOIN edu107 eeee on eee.EDU107_ID = eeee.EDU107_ID\n" +
            "where e.xnid = '31952' and t.xqid = '07' and week = '11' and edu104 = '8103'\n" +
            ") set CLOSED_STATE = '1'", nativeQuery = true)
    void closedScheduleTeacher(String xnid,String week,String xqid,String ed104_id);

    @Query(value = "select count(0) from edu203 where EDU202_ID in (select EDU202_ID from edu202 where EDU201_ID = ?1) and CLOSED_STATE = '1'", nativeQuery = true)
    String checkIsAskForExam(String edu201Id);
}
