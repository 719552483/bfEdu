package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu005;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu005Dao extends JpaRepository<Edu005, Long>, JpaSpecificationExecutor<Edu005> {
    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu005 where Edu201_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String scheduleId);

    //根据学生ID查询成绩和学分
    @Query(value = "select f.* from edu005 f where f.EDU001_ID = ?1 and f.EDU201_ID in ?2",nativeQuery = true)
    List<Edu005> findAllByStudent(String userKey,List<Long> edu201Ids);

    //根据任务书查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where t.Edu201_ID =?1",nativeQuery = true)
    String countAllByEdu201(Long edu201Id);

    //根据任务书查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where t.Edu201_ID =?1 and (t.grade = 'T' or t.grade > 60.00)",nativeQuery = true)
    String countPassByEdu201(Long edu201Id);
}
