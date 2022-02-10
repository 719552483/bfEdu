package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu005;
import com.beifen.edu.administration.domian.Edu0051;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu0051Dao extends JpaRepository<Edu0051, Long>, JpaSpecificationExecutor<Edu005> {

    //查询补考成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from EDU0051 where edu005_id = ?1 ORDER BY exam_num", nativeQuery = true)
    List<Edu0051> getHistoryGrade(String Edu005_Id);

    @Query(value = "select * from EDU0051 where edu005_id = ?1 and EXAM_NUM = '0'", nativeQuery = true)
    List<Edu0051> getHistoryGrade2(String Edu005_Id);

    @Query(value = "select * from EDU0051 where edu005_id = ?1 ORDER BY exam_num desc", nativeQuery = true)
    List<Edu0051> getHistoryGrade3(String Edu005_Id);

    //查询补考成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select e.* from EDU0051 e LEFT JOIN edu001 ee on e.STUDENT_CODE = ee.xh where xnid = ?1 and course_name = ?2 and ee.ZT_CODE != '003' and ee.ZT_CODE != '002' ORDER BY CLASS_NAME,STUDENT_NAME,exam_num", nativeQuery = true)
    List<Edu0051> exportMakeUpGrade(String trem,String crouses);

    //查询补考成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select e.* from EDU0051 e where xnid = ?1 and course_name = ?2 ORDER BY CLASS_NAME,STUDENT_NAME,exam_num", nativeQuery = true)
    List<Edu0051> exportMakeUpGradeAll(String trem,String crouses);

    //取消成绩确认删除
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from edu0051 where Edu005_id in ?1", nativeQuery = true)
    void deleteEdu0051sByEdu005Id(List<String> ids);

    @Query(value = "select * from EDU0051 where edu005_id = ?1 and exam_num = ?2", nativeQuery = true)
    Edu0051 getGradeByNum(String Edu005_Id,String num);

    @Query(value = "select * from edu0051 where EDU005_ID = ?1 and exam_num != 0 order by exam_num", nativeQuery = true)
    List<Edu0051> updateMUData(String Edu005_Id);


    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from edu0051 where EXAM_NUM != '0' and EXAM_NUM != '1'", nativeQuery = true)
    void deleteupdateMUData();
}
