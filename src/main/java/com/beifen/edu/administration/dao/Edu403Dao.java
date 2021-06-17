package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu403;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu403Dao extends JpaRepository<Edu403, Long>, JpaSpecificationExecutor<Edu403> {

    @Query(value = "SELECT * FROM EDU403 where xnid = ?1 ORDER BY ksz",nativeQuery = true)
    List<Edu403> selectAll(String id);

    // 根据学年id删除
    @Transactional
    @Modifying
    @Query(value = "delete from EDU403 where xnid =?1", nativeQuery = true)
    void removeKssxByXn(String id);

    // 根据edu403id删除
    @Transactional
    @Modifying
    @Query(value = "delete from EDU403 where EDU403_ID =?1", nativeQuery = true)
    void deleteKssxById(String id);

    //查询某一周限制的
    @Query(value = "SELECT kssx FROM EDU403 where xnid = ?1 and ksz <= ?2 and jsz >= ?2",nativeQuery = true)
    String queryXZCount(String xnid,String szz);
}
