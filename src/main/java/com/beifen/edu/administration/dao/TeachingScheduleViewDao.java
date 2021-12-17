package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.SchoolTimetablePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeachingScheduleViewDao extends JpaRepository<SchoolTimetablePO, Long>, JpaSpecificationExecutor<SchoolTimetablePO> {

    //教师查询周课表
    @Query(value = "select e.* from TEACHING_SCHEDULE_VIEW e where e.edu101_id = ?1 and e.week = ?2 and e.xnid = ?3",nativeQuery = true)
    List<SchoolTimetablePO> findAllByEdu101Id(String edu101id, String weekTime, String semester);

    @Query(value = "select distinct e.edu201_id from TEACHING_SCHEDULE_VIEW e where e.edu101_id = ?1 and e.xnid = ?2",nativeQuery = true)
    List<String> findEdu201IdsByEdu101Id(String edu101id, String semester);

    //教师查询周课表New
    @Query(value = "select e.* from TEACHING_SCHEDULE_VIEW e where e.edu201_id in ?1 and e.week = ?2 and e.xnid = ?3",nativeQuery = true)
    List<SchoolTimetablePO> findAllByEdu101IdNew(List<String> edu101id, String weekTime, String semester);

    @Query(value = "select * from TEACHING_SCHEDULE_VIEW where EDU101_ID = ?1 and kjid = ?4 and xqid = ?3 and week = ?2 and xnid = ?5",nativeQuery = true)
    List<SchoolTimetablePO> findCountByTeacher(String EDU101_ID,String week,String xqid,String kjid,String xnid);

    @Query(value = "select * from TEACHING_SCHEDULE_VIEW where point_id = ?1 and kjid = ?4 and xqid = ?3 and week = ?2 and xnid = ?5",nativeQuery = true)
    List<SchoolTimetablePO> findCountByPoint(String pointId,String week,String xqid,String kjid,String xnid);

    @Query(value = " select * from TEACHING_SCHEDULE_VIEW where edu201_id in  (select DISTINCT edu201_id from edu204 where edu300_id = ?1) and week = ?2 and xqid = ?3 and kjid = ?4 and xnid = ?5",nativeQuery = true)
    List<SchoolTimetablePO> findCountByClass(String findCountByClass,String week,String xqid,String kjid,String xnid);

    @Query(value = "select count(*) from TEACHING_SCHEDULE_VIEW where EDU101_ID = ?1 and XNID = ?2 and week = ?3",nativeQuery = true)
    int findCourseCountByXnAndEdu101IdAndWeek(String edu101_id,String xnid,String week);

    //排课限制查询
    @Query(value = "select count(*) from TEACHING_SCHEDULE_VIEW where Edu201_ID in (select e.Edu201_ID from edu204 e where e.Edu300_ID =?1) and xnid = ?2 and week = ?3",nativeQuery = true)
    int comfirmScheduleCheck(String classId,String xnid,String week);
}

