package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu0011;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu0011Dao extends JpaRepository<Edu0011, Long>, JpaSpecificationExecutor<Edu0011> {

    // 删除学生
    @Transactional
    @Modifying
    @Query(value = "delete from edu0011 where edu001_id =?1", nativeQuery = true)
    void removeStudentByEdu001ID(long studentId);


    @Transactional
    @Modifying
    @Query(value = "update edu0011 set jyxs = null,jyxsbm = null,dwmc = null,dwlxr = null,dwlxdh = null,dwdz = null,bz = null where edu0011_id = ?1", nativeQuery = true)
    void clearEmploymentStudents(String id);

    //根据id查学生学号
    @Query(value = "select e.* from edu0011 e where e.xh =?1", nativeQuery = true)
    Edu0011 query001ByXh2(String xh);

    @Query(value = "select count(0) from edu0011 where szxb = ?1 and nj = ?2", nativeQuery = true)
    int findXbrs(String szxb,String nj);

    @Query(value = "select count(0) from edu0011 where szxb = ?1 and nj = ?2 and jyxsbm is not null", nativeQuery = true)
    int findXbjyrs(String szxb,String nj);

    @Query(value = "select count(0) from edu0011 where zybm = ?1 and nj = ?2", nativeQuery = true)
    int findZyrs(String zybm,String nj);

    @Query(value = "select count(0) from edu0011 where zybm = ?1 and nj = ?2 and jyxsbm is not null", nativeQuery = true)
    int findZyjyrs(String zybm,String nj);

    @Query(value = "select count(0) from edu0011 where zybm = ?1 and jyxsbm =?2 and nj = ?3", nativeQuery = true)
    int findJyxsrs(String zybm,String jyxsbm,String nj);

    @Query(value = "select count(0) from edu0011 where nj = ?1", nativeQuery = true)
    int findNjrs(String nj);

    @Query(value = "select count(0) from edu0011 where nj = ?1 and jyxsbm is not null", nativeQuery = true)
    int findNjjyrs(String nj);

    @Query(value = "select count(*) from edu0011 e LEFT JOIN edu001 ee on e.edu001_id = ee.edu001_id where ee.zt_code = '004' and jyxs is not null", nativeQuery = true)
    String findAllJYCount();

    @Query(value = "select count(*) from edu0011 e LEFT JOIN edu001 ee on e.edu001_id = ee.edu001_id LEFT JOIN edu300 eee on ee.edu300_id = eee.edu300_id where ee.zt_code = '004' and jyxs is not null and ee.nj = ?1 and eee.batch = ?2", nativeQuery = true)
    String findAllJYCount(String nj,String batch);
}
